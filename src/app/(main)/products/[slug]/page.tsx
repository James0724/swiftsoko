import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/map-product";
import { ProductDetailClient } from "./product-detail-client";
import { absoluteUrl, stripHtml, truncate } from "@/lib/seo";

export const dynamic = "force-dynamic";

const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true, subCategory: true, brand: true },
  });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const productRow = await getProductBySlug(slug);
  if (!productRow) {
    return { title: "Product Not Found" };
  }

  const product = mapProduct(productRow);
  const rawText = stripHtml(product.shortDescription || product.description || "");
  const description = truncate(
    rawText
      ? `${product.name} — KSh ${product.price.toLocaleString()}. ${rawText} Fast delivery in Nairobi. Shop now on Swiftsoko.`
      : `Buy ${product.name} at KSh ${product.price.toLocaleString()} in the ${product.category} category. Fast delivery in Nairobi, Kenya — only on Swiftsoko.`,
    160
  );
  const title = `${product.name} — Buy Online in Kenya`;
  const url = absoluteUrl(`/products/${product.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: product.image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productRow = await getProductBySlug(slug);

  if (!productRow) {
    notFound();
  }

  const product = mapProduct(productRow);

  const relatedRows = await prisma.product.findMany({
    where: { categoryId: productRow.categoryId, id: { not: productRow.id } },
    include: { category: true, subCategory: true, brand: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const productUrl = absoluteUrl(`/products/${product.slug}`);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      stripHtml(product.shortDescription || product.description || "") || product.name,
    image: product.images,
    sku: product.sku || undefined,
    category: product.category,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "KES",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Products", item: absoluteUrl("/products") },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: absoluteUrl(`/products/category/${product.categorySlug}`),
      },
      { "@type": "ListItem", position: 4, name: product.name, item: productUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient product={product} related={relatedRows.map(mapProduct)} />
    </>
  );
}
