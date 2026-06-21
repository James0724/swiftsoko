import type { Product as PrismaProduct, Category } from "@/generated/prisma/client";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  categorySlug: string;
  subCategory: string;
  subCategorySlug: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  description: string;
  stock: number;
  sku: string;
  brand?: string;
  sizes?: string[];
  tags?: string[];
  specs?: Record<string, string>;
  highlights?: string[];
}

export type ProductWithRelations = PrismaProduct & {
  category: Category;
  subCategory: Category | null;
};

const NEW_THRESHOLD_MS = 14 * 24 * 60 * 60 * 1000;

export function mapProduct(product: ProductWithRelations): Product {
  const isOnSale = !!(
    product.originalPrice && product.originalPrice > product.price
  );
  const isNew = Date.now() - product.createdAt.getTime() < NEW_THRESHOLD_MS;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    category: product.category.name,
    categorySlug: product.category.slug,
    subCategory: product.subCategory?.name ?? "",
    subCategorySlug: product.subCategory?.slug ?? "",
    isNew,
    isFeatured: product.isFeatured,
    isOnSale,
    image: product.coverImage.url,
    images: [product.coverImage.url, ...product.images.map((i) => i.url)],
    rating: 0,
    reviews: 0,
    description: product.description ?? "",
    stock: product.stock,
    sku: product.sku ?? "",
  };
}

/** Admin-only shape that also carries Cloudinary publicIds, needed to manage
 *  (replace/remove) individual images from the dashboard. Never exposed to
 *  the public storefront. */
export interface AdminProduct extends Product {
  coverImagePublicId: string;
  galleryImages: { url: string; publicId: string }[];
}

export function mapAdminProduct(product: ProductWithRelations): AdminProduct {
  return {
    ...mapProduct(product),
    coverImagePublicId: product.coverImage.publicId,
    galleryImages: product.images.map((i) => ({ url: i.url, publicId: i.publicId })),
  };
}
