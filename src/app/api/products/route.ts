import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadProductImage, deleteProductImages } from "@/lib/cloudinary";
import { resolveCategoryIds } from "@/lib/category";
import { generateUniqueSlug } from "@/lib/slug";
import { mapAdminProduct } from "@/lib/map-product";

const MAX_GALLERY_IMAGES = 4;

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const name = (formData.get("name") as string)?.trim();
  const price = parseFloat(formData.get("price") as string);
  const originalPriceRaw = formData.get("originalPrice") as string;
  const originalPrice = originalPriceRaw ? parseFloat(originalPriceRaw) : undefined;
  const stock = parseInt(formData.get("stock") as string, 10);
  const sku = (formData.get("sku") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const categorySlug = (formData.get("categorySlug") as string)?.trim();
  const subCategorySlug = (formData.get("subCategorySlug") as string)?.trim() || undefined;
  const isFeatured = formData.get("isFeatured") === "true";
  const coverFile = formData.get("cover") as File | null;
  const imageFiles = (formData.getAll("images") as File[]).filter(
    (f) => f instanceof File && f.size > 0
  );

  if (!name || isNaN(price) || !categorySlug) {
    return NextResponse.json(
      { error: "Name, price, and category are required" },
      { status: 400 }
    );
  }
  if (!coverFile || coverFile.size === 0) {
    return NextResponse.json({ error: "A cover image is required" }, { status: 400 });
  }
  if (imageFiles.length > MAX_GALLERY_IMAGES) {
    return NextResponse.json(
      { error: `You can upload at most ${MAX_GALLERY_IMAGES} gallery images` },
      { status: 400 }
    );
  }

  const categoryIds = await resolveCategoryIds(categorySlug, subCategorySlug);
  if (!categoryIds) {
    return NextResponse.json({ error: "Invalid category or subcategory" }, { status: 400 });
  }

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id },
  });
  if (!account) {
    return NextResponse.json({ error: "No linked account found" }, { status: 400 });
  }

  // Upload cover + gallery images to Cloudinary; roll back everything uploaded
  // so far if any step fails, to avoid orphaning assets.
  const uploaded: { publicId: string; url: string }[] = [];
  let cover: { publicId: string; url: string };
  try {
    cover = await uploadProductImage(coverFile);
    uploaded.push(cover);
    for (const file of imageFiles) {
      uploaded.push(await uploadProductImage(file));
    }
  } catch {
    await deleteProductImages(uploaded.map((i) => i.publicId));
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }

  const gallery = uploaded.slice(1);
  const slug = await generateUniqueSlug(name);

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price,
        originalPrice,
        stock: isNaN(stock) ? 0 : stock,
        sku: sku || undefined,
        description: description || undefined,
        isFeatured,
        coverImage: cover,
        images: gallery,
        categoryId: categoryIds.categoryId,
        subCategoryId: categoryIds.subCategoryId ?? undefined,
        userId: session.user.id,
        accountId: account.id,
      },
      include: { category: true, subCategory: true },
    });
    return NextResponse.json({ product: mapAdminProduct(product) }, { status: 201 });
  } catch (err) {
    await deleteProductImages(uploaded.map((i) => i.publicId));
    console.error("Product create failed:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { category: true, subCategory: true },
  });

  return NextResponse.json({ products: products.map(mapAdminProduct) });
}
