import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/data/categories";
import { absoluteUrl, truncate } from "@/lib/seo";
import { ProductsContent } from "../../products-content";
import { getCategoryPageData } from "../_data";

export const revalidate = 3600;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ categorySlug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const data = await getCategoryPageData(categorySlug);
  if (!data) return { title: "Category Not Found" };

  const { categoryMeta } = data;
  const subNames = categoryMeta.subcategories.slice(0, 4).map((s) => s.name).join(", ");
  const title = `${categoryMeta.name} in Kenya — Shop Online`;
  const description = truncate(
    `Shop ${categoryMeta.name} online in Kenya: ${subNames}. Genuine products, fast delivery in Nairobi — only on Swiftsoko.`,
    160
  );
  const url = absoluteUrl(`/products/category/${categoryMeta.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const data = await getCategoryPageData(categorySlug);

  if (!data) {
    notFound();
  }

  const { categoryMeta, products } = data;
  const categoryUrl = absoluteUrl(`/products/category/${categoryMeta.slug}`);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryMeta.name} — Swiftsoko`,
    url: categoryUrl,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.slice(0, 20).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/products/${product.slug}`),
        name: product.name,
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Products", item: absoluteUrl("/products") },
      { "@type": "ListItem", position: 3, name: categoryMeta.name, item: categoryUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Suspense>
        <ProductsContent products={products} defaultCategorySlug={categoryMeta.slug} />
      </Suspense>
    </>
  );
}
