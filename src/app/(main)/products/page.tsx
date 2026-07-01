import { Suspense } from "react";
import { permanentRedirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/map-product";
import { findCategoryMeta } from "@/lib/category";
import { ProductsContent } from "./products-content";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcategory?: string }>;
}) {
  const { category, subcategory } = await searchParams;

  // Legacy ?category= links now have a real, crawlable URL — redirect to consolidate SEO signal.
  if (category && findCategoryMeta(category)) {
    permanentRedirect(
      subcategory
        ? `/products/category/${category}/${subcategory}`
        : `/products/category/${category}`
    );
  }

  const rows = await prisma.product.findMany({
    include: { category: true, subCategory: true, brand: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Suspense>
      <ProductsContent products={rows.map(mapProduct)} />
    </Suspense>
  );
}
