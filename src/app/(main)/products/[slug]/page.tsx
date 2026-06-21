import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/map-product";
import { ProductDetailClient } from "./product-detail-client";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productRow = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, subCategory: true },
  });

  if (!productRow) {
    notFound();
  }

  const product = mapProduct(productRow);

  const relatedRows = await prisma.product.findMany({
    where: { categoryId: productRow.categoryId, id: { not: productRow.id } },
    include: { category: true, subCategory: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <ProductDetailClient product={product} related={relatedRows.map(mapProduct)} />
  );
}
