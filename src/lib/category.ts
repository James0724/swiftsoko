import { CATEGORIES } from "@/lib/data/categories";
import { prisma } from "@/lib/prisma";

export function findCategoryMeta(categorySlug: string) {
  return CATEGORIES.find((c) => c.slug === categorySlug) ?? null;
}

export async function resolveCategoryIds(
  categorySlug: string,
  subCategorySlug?: string | null
): Promise<{ categoryId: string; subCategoryId: string | null } | null> {
  const categoryMeta = findCategoryMeta(categorySlug);
  if (!categoryMeta) return null;

  let subCategoryMeta = null;
  if (subCategorySlug) {
    subCategoryMeta =
      categoryMeta.subcategories.find((s) => s.slug === subCategorySlug) ?? null;
    if (!subCategoryMeta) return null;
  }

  const category = await prisma.category.upsert({
    where: { slug: categoryMeta.slug },
    update: { name: categoryMeta.name },
    create: { name: categoryMeta.name, slug: categoryMeta.slug },
  });

  let subCategoryId: string | null = null;
  if (subCategoryMeta) {
    const subCategory = await prisma.category.upsert({
      where: { slug: subCategoryMeta.slug },
      update: { name: subCategoryMeta.name, parentId: category.id },
      create: {
        name: subCategoryMeta.name,
        slug: subCategoryMeta.slug,
        parentId: category.id,
      },
    });
    subCategoryId = subCategory.id;
  }

  return { categoryId: category.id, subCategoryId };
}
