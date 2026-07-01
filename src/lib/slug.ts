import { prisma } from "@/lib/prisma";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || "product";
  let slug = base;
  let suffix = 2;

  while (
    await prisma.product.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function generateUniqueBrandSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || "brand";
  let slug = base;
  let suffix = 2;

  while (
    await prisma.brand.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}
