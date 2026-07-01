import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/map-product";
import { findCategoryMeta, resolveCategoryIds } from "@/lib/category";

export const getCategoryPageData = cache(
  async (categorySlug: string, subCategorySlug?: string) => {
    const categoryMeta = findCategoryMeta(categorySlug);
    if (!categoryMeta) return null;

    let subCategoryMeta = null;
    if (subCategorySlug) {
      subCategoryMeta =
        categoryMeta.subcategories.find((s) => s.slug === subCategorySlug) ?? null;
      if (!subCategoryMeta) return null;
    }

    const ids = await resolveCategoryIds(categorySlug, subCategorySlug);
    if (!ids) return null;

    const rows = await prisma.product.findMany({
      where: subCategoryMeta
        ? { subCategoryId: ids.subCategoryId }
        : { categoryId: ids.categoryId },
      include: { category: true, subCategory: true, brand: true },
      orderBy: { createdAt: "desc" },
    });

    return {
      categoryMeta,
      subCategoryMeta,
      products: rows.map(mapProduct),
    };
  }
);
