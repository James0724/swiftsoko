import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/map-product";
import { ProductsContent } from "./products-content";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const rows = await prisma.product.findMany({
    include: { category: true, subCategory: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Suspense>
      <ProductsContent products={rows.map(mapProduct)} />
    </Suspense>
  );
}
