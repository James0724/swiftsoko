import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  uploadProductImage,
  deleteProductImages,
  extractPublicId,
} from "@/lib/cloudinary";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.product.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const imageFiles = formData.getAll("images") as File[];
  const validFiles = imageFiles.filter((f) => f instanceof File && f.size > 0);

  // Upload new images first
  const newlyUploaded: { publicId: string; url: string }[] = [];
  if (validFiles.length > 0) {
    try {
      for (const file of validFiles) {
        const result = await uploadProductImage(file);
        newlyUploaded.push(result);
      }
    } catch {
      // Roll back any partial uploads
      await deleteProductImages(newlyUploaded.map((i) => i.publicId));
      return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }
  }

  // Build the update payload from non-empty form fields
  const updateData: Record<string, unknown> = {};
  const name = (formData.get("name") as string)?.trim();
  const priceStr = formData.get("price") as string;
  const stockStr = formData.get("stock") as string;
  const sku = (formData.get("sku") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (name) updateData.name = name;
  if (priceStr) {
    const price = parseFloat(priceStr);
    if (!isNaN(price)) updateData.price = price;
  }
  if (stockStr) {
    const stock = parseInt(stockStr, 10);
    if (!isNaN(stock)) updateData.stock = stock;
  }
  if (sku) updateData.sku = sku;
  if (description) updateData.description = description;
  if (newlyUploaded.length > 0) {
    updateData.images = newlyUploaded.map((i) => i.url);
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    // Only delete old Cloudinary images after the DB update succeeds
    if (newlyUploaded.length > 0 && existing.images.length > 0) {
      const oldPublicIds = existing.images
        .map(extractPublicId)
        .filter((pid) => pid.length > 0);
      await deleteProductImages(oldPublicIds);
    }

    return NextResponse.json({ product });
  } catch (err) {
    // DB update failed — roll back newly uploaded images to prevent orphans
    if (newlyUploaded.length > 0) {
      await deleteProductImages(newlyUploaded.map((i) => i.publicId));
    }
    console.error("Product update failed:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });

  // Clean up images from Cloudinary after successful DB delete
  if (product.images.length > 0) {
    const publicIds = product.images
      .map(extractPublicId)
      .filter((pid) => pid.length > 0);
    await deleteProductImages(publicIds);
  }

  return NextResponse.json({ success: true });
}
