import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadProductImage, deleteProductImages } from "@/lib/cloudinary";

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
  const stock = parseInt(formData.get("stock") as string, 10);
  const sku = (formData.get("sku") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const details = (formData.get("details") as string)?.trim();
  const categoryName = (formData.get("category") as string)?.trim();
  const imageFiles = formData.getAll("images") as File[];

  if (!name || isNaN(price) || !categoryName) {
    return NextResponse.json(
      { error: "Name, price, and category are required" },
      { status: 400 }
    );
  }

  // Look up or create category
  const slug = categoryName.toLowerCase().replace(/\s+/g, "-");
  let category = await prisma.category.findUnique({ where: { slug } });
  if (!category) {
    category = await prisma.category.create({
      data: { name: categoryName, slug },
    });
  }

  // Look up the user's linked account
  const account = await prisma.account.findFirst({
    where: { userId: session.user.id },
  });
  if (!account) {
    return NextResponse.json({ error: "No linked account found" }, { status: 400 });
  }

  // Upload images to Cloudinary product-images folder
  const uploaded: { publicId: string; url: string }[] = [];
  const validFiles = imageFiles.filter((f) => f instanceof File && f.size > 0);

  try {
    for (const file of validFiles) {
      const result = await uploadProductImage(file);
      uploaded.push(result);
    }
  } catch (err) {
    // Roll back any partial uploads to prevent orphaned images
    await deleteProductImages(uploaded.map((i) => i.publicId));
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }

  // Save product to DB; roll back images on failure
  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        stock: isNaN(stock) ? 0 : stock,
        sku: sku || undefined,
        description: [details, description].filter(Boolean).join("\n\n") || undefined,
        images: uploaded.map((i) => i.url),
        categoryId: category.id,
        userId: session.user.id,
        accountId: account.id,
      },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    // DB create failed — delete the uploaded images to prevent orphans
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
  });

  return NextResponse.json({ products });
}
