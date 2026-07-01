import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadBrandLogo, deleteBrandLogo } from "@/lib/cloudinary";
import { generateUniqueBrandSlug } from "@/lib/slug";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.brand.findFirst({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const website = (formData.get("website") as string)?.trim() || null;
  const country = (formData.get("country") as string)?.trim() || null;
  const foundedYearRaw = formData.get("foundedYear") as string;
  const isActiveRaw = formData.get("isActive") as string;
  const logoFile = formData.get("logo") as File | null;
  const removeLogo = formData.get("removeLogo") === "true";

  const updateData: Record<string, unknown> = {};

  if (name && name !== existing.name) {
    updateData.name = name;
    updateData.slug = await generateUniqueBrandSlug(name, id);
  } else if (name) {
    updateData.name = name;
  }

  if (description !== null) updateData.description = description || null;
  if (website !== null) updateData.website = website || null;
  if (country !== null) updateData.country = country || null;

  if (foundedYearRaw !== null && foundedYearRaw !== "") {
    const yr = parseInt(foundedYearRaw, 10);
    updateData.foundedYear = isNaN(yr) ? null : yr;
  }

  if (isActiveRaw !== null) {
    updateData.isActive = isActiveRaw !== "false";
  }

  let newLogo: { publicId: string; url: string } | null = null;

  if (removeLogo && existing.logo) {
    updateData.logo = null;
  } else if (logoFile && logoFile.size > 0) {
    try {
      newLogo = await uploadBrandLogo(logoFile);
      updateData.logo = newLogo;
    } catch {
      return NextResponse.json({ error: "Logo upload failed" }, { status: 500 });
    }
  }

  try {
    const brand = await prisma.brand.update({
      where: { id },
      data: updateData,
    });

    // Delete old logo from Cloudinary after successful DB update
    if (newLogo && existing.logo) {
      await deleteBrandLogo(existing.logo.publicId).catch(() => {});
    } else if (removeLogo && existing.logo) {
      await deleteBrandLogo(existing.logo.publicId).catch(() => {});
    }

    return NextResponse.json({ brand });
  } catch (err) {
    if (newLogo) await deleteBrandLogo(newLogo.publicId).catch(() => {});
    console.error("Brand update failed:", err);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
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
  const brand = await prisma.brand.findFirst({ where: { id } });
  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  const productCount = await prisma.product.count({ where: { brandId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete brand: ${productCount} product(s) are linked to it` },
      { status: 409 }
    );
  }

  await prisma.brand.delete({ where: { id } });

  if (brand.logo) {
    await deleteBrandLogo(brand.logo.publicId).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
