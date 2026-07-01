import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadBrandLogo, deleteBrandLogo } from "@/lib/cloudinary";
import { generateUniqueBrandSlug } from "@/lib/slug";

export async function GET() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ brands });
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const name = (formData.get("name") as string)?.trim();
  if (!name) {
    return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
  }

  const description = (formData.get("description") as string)?.trim() || undefined;
  const website = (formData.get("website") as string)?.trim() || undefined;
  const country = (formData.get("country") as string)?.trim() || undefined;
  const foundedYearRaw = formData.get("foundedYear") as string;
  const foundedYear = foundedYearRaw ? parseInt(foundedYearRaw, 10) : undefined;
  const isActive = formData.get("isActive") !== "false";
  const logoFile = formData.get("logo") as File | null;

  const slug = await generateUniqueBrandSlug(name);

  let logo: { publicId: string; url: string } | undefined;
  if (logoFile && logoFile.size > 0) {
    try {
      logo = await uploadBrandLogo(logoFile);
    } catch {
      return NextResponse.json({ error: "Logo upload failed" }, { status: 500 });
    }
  }

  try {
    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        description,
        website,
        country,
        foundedYear: foundedYear && !isNaN(foundedYear) ? foundedYear : undefined,
        isActive,
        ...(logo ? { logo } : {}),
      },
    });
    return NextResponse.json({ brand }, { status: 201 });
  } catch (err) {
    if (logo) await deleteBrandLogo(logo.publicId).catch(() => {});
    console.error("Brand create failed:", err);
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}
