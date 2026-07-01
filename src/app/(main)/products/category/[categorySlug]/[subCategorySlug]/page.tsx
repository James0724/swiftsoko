import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/data/categories";
import { absoluteUrl, truncate } from "@/lib/seo";
import { ProductsContent } from "../../../products-content";
import { getCategoryPageData } from "../../_data";

export const revalidate = 3600;

export function generateStaticParams() {
  return CATEGORIES.flatMap((category) =>
    category.subcategories.map((sub) => ({
      categorySlug: category.slug,
      subCategorySlug: sub.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; subCategorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug, subCategorySlug } = await params;
  const data = await getCategoryPageData(categorySlug, subCategorySlug);
  if (!data || !data.subCategoryMeta) return { title: "Category Not Found" };

  const { categoryMeta, subCategoryMeta } = data;
  const title = `${subCategoryMeta.name} — ${categoryMeta.name} in Kenya`;
  const description = truncate(
    `Shop ${subCategoryMeta.name} in the ${categoryMeta.name} category online in Kenya. Genuine products, fast delivery in Nairobi — only on Swiftsoko.`,
    160
  );
  const url = absoluteUrl(`/products/category/${categoryMeta.slug}/${subCategoryMeta.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SubCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string; subCategorySlug: string }>;
}) {
  const { categorySlug, subCategorySlug } = await params;
  const data = await getCategoryPageData(categorySlug, subCategorySlug);

  if (!data || !data.subCategoryMeta) {
    notFound();
  }

  const { categoryMeta, subCategoryMeta, products } = data;
  const categoryUrl = absoluteUrl(`/products/category/${categoryMeta.slug}`);
  const subCategoryUrl = `${categoryUrl}/${subCategoryMeta.slug}`;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${subCategoryMeta.name} — Swiftsoko`,
    url: subCategoryUrl,
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
      { "@type": "ListItem", position: 4, name: subCategoryMeta.name, item: subCategoryUrl },
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
        <ProductsContent
          products={products}
          defaultCategorySlug={categoryMeta.slug}
          defaultSubCategorySlug={subCategoryMeta.slug}
        />
      </Suspense>
    </>
  );
}
