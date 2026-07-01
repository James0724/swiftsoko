import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadProductImage, deleteProductImages } from "@/lib/cloudinary";
import { resolveCategoryIds } from "@/lib/category";
import { generateUniqueSlug } from "@/lib/slug";
import { mapAdminProduct } from "@/lib/map-product";
import {
  sanitizeProductHtml,
  countWords,
  SHORT_DESCRIPTION_MAX_WORDS,
} from "@/lib/sanitize-html";
import { sanitizeSections } from "@/lib/product-sections";

const MAX_GALLERY_IMAGES = 4;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.product.findFirst({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const coverFile = formData.get("cover") as File | null;
  const hasNewCover = coverFile instanceof File && coverFile.size > 0;
  const newGalleryFiles = (formData.getAll("images") as File[]).filter(
    (f) => f instanceof File && f.size > 0
  );
  const keepPublicIds = (formData.getAll("keepImage") as string[]).filter(Boolean);
  const keptImages = existing.images.filter((img) => keepPublicIds.includes(img.publicId));
  const galleryTouched = formData.has("galleryTouched");

  if (keptImages.length + newGalleryFiles.length > MAX_GALLERY_IMAGES) {
    return NextResponse.json(
      { error: `You can have at most ${MAX_GALLERY_IMAGES} gallery images` },
      { status: 400 }
    );
  }

  // Upload any new images first; roll back everything uploaded in this
  // request if any step fails.
  const newlyUploaded: { publicId: string; url: string }[] = [];
  let newCover: { publicId: string; url: string } | null = null;
  try {
    if (hasNewCover) {
      newCover = await uploadProductImage(coverFile as File);
      newlyUploaded.push(newCover);
    }
    for (const file of newGalleryFiles) {
      newlyUploaded.push(await uploadProductImage(file));
    }
  } catch {
    await deleteProductImages(newlyUploaded.map((i) => i.publicId));
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }

  const newGalleryUploads = hasNewCover ? newlyUploaded.slice(1) : newlyUploaded;

  // Build the update payload from non-empty form fields
  const updateData: Record<string, unknown> = {};
  const name = (formData.get("name") as string)?.trim();
  const priceStr = formData.get("price") as string;
  const originalPriceStr = formData.get("originalPrice") as string;
  const stockStr = formData.get("stock") as string;
  const skuRaw = formData.get("sku") as string | null;
  const shortDescriptionRaw = formData.get("shortDescription") as string | null;
  const descriptionRaw = formData.get("description") as string | null;
  const sectionsRaw = formData.get("sections") as string | null;
  const categorySlug = (formData.get("categorySlug") as string)?.trim();
  const subCategorySlug = (formData.get("subCategorySlug") as string)?.trim() || undefined;
  const brandIdRaw = (formData.get("brandId") as string)?.trim();

  if (name) updateData.name = name;
  if (name && name !== existing.name) {
    updateData.slug = await generateUniqueSlug(name, existing.id);
  }
  if (priceStr) {
    const price = parseFloat(priceStr);
    if (!isNaN(price)) updateData.price = price;
  }
  if (originalPriceStr !== null) {
    const originalPrice = parseFloat(originalPriceStr);
    updateData.originalPrice = isNaN(originalPrice) ? null : originalPrice;
  }
  if (stockStr !== null) {
    const stock = parseInt(stockStr, 10);
    updateData.stock = isNaN(stock) ? 0 : stock;
  }
  if (skuRaw !== null) {
    const sku = skuRaw.trim();
    updateData.sku = sku || null;
  }
  if (shortDescriptionRaw !== null) {
    const shortDescription = shortDescriptionRaw.trim();
    const shortDescriptionWords = countWords(shortDescription);
    if (shortDescriptionWords === 0) {
      await deleteProductImages(newlyUploaded.map((i) => i.publicId));
      return NextResponse.json(
        { error: "Short description is required" },
        { status: 400 }
      );
    }
    if (shortDescriptionWords > SHORT_DESCRIPTION_MAX_WORDS) {
      await deleteProductImages(newlyUploaded.map((i) => i.publicId));
      return NextResponse.json(
        { error: `Short description must be ${SHORT_DESCRIPTION_MAX_WORDS} words or fewer` },
        { status: 400 }
      );
    }
    updateData.shortDescription = shortDescription;
  }
  if (descriptionRaw !== null) {
    const description = descriptionRaw.trim();
    updateData.description = description ? sanitizeProductHtml(description) : null;
  }
  if (sectionsRaw !== null) {
    try {
      updateData.sections = sanitizeSections(JSON.parse(sectionsRaw));
    } catch {
      updateData.sections = [];
    }
  }
  if (newCover) updateData.coverImage = newCover;
  if (galleryTouched) {
    updateData.images = [...keptImages, ...newGalleryUploads];
  }

  if (categorySlug) {
    const categoryIds = await resolveCategoryIds(categorySlug, subCategorySlug);
    if (!categoryIds) {
      await deleteProductImages(newlyUploaded.map((i) => i.publicId));
      return NextResponse.json({ error: "Invalid category or subcategory" }, { status: 400 });
    }
    updateData.categoryId = categoryIds.categoryId;
    updateData.subCategoryId = categoryIds.subCategoryId ?? null;
  }

  if (brandIdRaw) {
    const brandExists = await prisma.brand.findFirst({ where: { id: brandIdRaw } });
    if (!brandExists) {
      await deleteProductImages(newlyUploaded.map((i) => i.publicId));
      return NextResponse.json({ error: "Invalid brand" }, { status: 400 });
    }
    updateData.brandId = brandIdRaw;
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true, subCategory: true, brand: true },
    });

    // Only delete replaced/removed Cloudinary assets after the DB update succeeds
    const removedPublicIds: string[] = [];
    if (newCover) removedPublicIds.push(existing.coverImage.publicId);
    const removedGalleryImages = existing.images.filter(
      (img) => !keepPublicIds.includes(img.publicId)
    );
    if (galleryTouched) {
      removedPublicIds.push(...removedGalleryImages.map((i) => i.publicId));
    }
    await deleteProductImages(removedPublicIds);

    return NextResponse.json({ product: mapAdminProduct(product) });
  } catch (err) {
    await deleteProductImages(newlyUploaded.map((i) => i.publicId));
    console.error("Product update failed:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const product = await prisma.product.findFirst({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });

  const publicIds = [
    product.coverImage.publicId,
    ...product.images.map((i) => i.publicId),
  ].filter(Boolean);
  await deleteProductImages(publicIds);

  return NextResponse.json({ success: true });
}
