"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Minus,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RefreshCcw,
  Star,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Package,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Product } from "@/lib/map-product";
import { useCartStore } from "@/store/use-cart-store";
import { ProductCard } from "@/components/ui/product-card";
import { RichTextContent } from "@/components/ui/rich-text-content";

export function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[1] ?? product.sizes?.[0] ?? ""
  );
  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ ...product, img: product.image } as any);
    }
    openCart();
  };

  const handleShare = () => {
    const url = window.location.href;
    const text = `Check out ${product.name} on Swiftsoko — KSh ${product.price.toLocaleString()}\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const stockStatus =
    product.stock === 0
      ? { label: "Out of Stock", color: "bg-red-500" }
      : product.stock <= 5
      ? { label: `Only ${product.stock} left — order soon`, color: "bg-orange-400" }
      : product.stock <= 15
      ? { label: `${product.stock} in stock`, color: "bg-yellow-400" }
      : { label: "In Stock", color: "bg-green-500" };

  return (
    <div className="min-h-screen bg-white">
      {/* ── BREADCRUMB ── */}
      <div className="border-b-2 border-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest flex-wrap">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
          <Link href="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
          <Link href={`/products/category/${product.categorySlug}`} className="hover:text-indigo-600 transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-gray-400 line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* Back link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 font-black uppercase text-xs tracking-widest mb-8 hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        {/* ── MAIN PRODUCT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── LEFT: IMAGE GALLERY ── */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="border-4 border-black bg-gray-50 aspect-square overflow-hidden relative group">
              {product.isNew && (
                <Badge className="absolute top-4 left-4 z-10 rounded-none border-2 border-black bg-yellow-300 text-black font-black uppercase text-xs px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  New Drop
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="absolute top-4 right-4 z-10 rounded-none bg-red-600 text-white font-black uppercase text-sm px-3 py-1">
                  -{discount}% OFF
                </Badge>
              )}
              <Image
                src={product.images[activeImage]}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                alt={`${product.name} – ${product.category} | Swiftsoko`}
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative border-2 aspect-square overflow-hidden transition-all ${
                      activeImage === i
                        ? "border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-x-px -translate-y-px"
                        : "border-gray-200 hover:border-black opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      fill
                      sizes="120px"
                      className="object-cover"
                      alt={`${product.name} view ${i + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* SKU + Brand row */}
            <div className="flex justify-between items-center pt-1 border-t border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                SKU: {product.sku}
              </span>
              {product.brand && (
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  By {product.brand}
                </span>
              )}
            </div>
          </div>

          {/* ── RIGHT: PRODUCT INFO ── */}
          <div className="flex flex-col gap-5">

            {/* Category chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/products/category/${product.categorySlug}`}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 border-2 border-indigo-200 bg-indigo-50 px-2 py-1 hover:bg-indigo-100 hover:border-indigo-400 transition-colors"
              >
                {product.category}
              </Link>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-200 px-2 py-1">
                {product.subCategory}
              </span>
              {product.isOnSale && (
                <span className="text-[10px] font-black uppercase tracking-widest text-red-600 border-2 border-red-200 bg-red-50 px-2 py-1">
                  On Sale
                </span>
              )}
            </div>

            {/* Product name */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black uppercase italic tracking-tighter leading-[0.9]">
              {product.name}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : i < product.rating
                        ? "fill-yellow-200 text-yellow-400"
                        : "text-gray-200 fill-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="font-black text-sm">{product.rating}</span>
              <span className="font-bold text-xs text-gray-400 uppercase tracking-widest">
                {product.reviews.toLocaleString()} verified reviews
              </span>
            </div>

            {/* Price block */}
            <div className="bg-black text-white p-4 flex items-center gap-4 flex-wrap border-4 border-black shadow-[6px_6px_0px_0px_rgba(254,240,138,1)]">
              <span className="text-4xl font-black italic text-yellow-400">
                KSh {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl font-bold text-gray-500 line-through">
                    KSh {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-600 text-white font-black uppercase italic tracking-tighter text-sm px-3 py-1 border-2 border-red-400">
                    YOU SAVE KSh {(product.originalPrice - product.price).toLocaleString()} ({discount}%)
                  </span>
                </>
              )}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p className="font-bold text-gray-700 leading-relaxed text-sm border-l-4 border-yellow-400 pl-4 whitespace-pre-line">
                {product.shortDescription}
              </p>
            )}

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="space-y-2">
                <p className="font-black uppercase text-[10px] tracking-widest text-gray-400 border-b border-gray-100 pb-1">
                  Key Features
                </p>
                <ul className="space-y-2">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-bold text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-black uppercase text-xs tracking-widest">
                    Select Size
                    {selectedSize && (
                      <span className="ml-2 text-indigo-600">— {selectedSize}</span>
                    )}
                  </span>
                  <button className="font-bold text-[10px] uppercase tracking-widest underline hover:text-indigo-600 transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border-2 px-4 py-2 font-black text-sm transition-all ${
                        selectedSize === size
                          ? "border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(99,102,241,1)]"
                          : "border-gray-200 text-gray-500 hover:border-black hover:text-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock indicator */}
            <div className="flex items-center gap-2 border-2 border-black px-4 py-2 bg-gray-50">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${stockStatus.color}`} />
              <span className="text-xs font-black uppercase tracking-widest">
                {stockStatus.label}
              </span>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex border-4 border-black h-14 items-center bg-white shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 hover:bg-yellow-100 h-full border-r-4 border-black transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 font-black text-xl min-w-[3.5rem] text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-4 hover:bg-yellow-100 h-full border-l-4 border-black transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 rounded-none bg-black text-white h-14 text-sm font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(254,240,138,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock === 0 ? "Out of Stock" : "Add to Bag"}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setWishlisted((w) => !w)}
                className={`h-14 w-14 border-4 rounded-none shrink-0 transition-all ${
                  wishlisted
                    ? "border-red-500 bg-red-50 text-red-500"
                    : "border-black hover:bg-red-50 hover:border-red-500 hover:text-red-500"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500" : ""}`} />
              </Button>
            </div>

            {/* Secondary CTA */}
            <Button
              variant="outline"
              className="w-full rounded-none border-2 border-black font-black uppercase tracking-widest h-11 hover:bg-gray-50 text-xs"
            >
              <Zap className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-400" />
              Buy Now — Instant Checkout
            </Button>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Truck, title: "Fast Delivery", sub: "1–3 days Nairobi", bg: "bg-blue-50" },
                { icon: ShieldCheck, title: "Warranty", sub: "2-year coverage", bg: "bg-green-50" },
                { icon: RefreshCcw, title: "Free Returns", sub: "Within 14 days", bg: "bg-orange-50" },
              ].map(({ icon: Icon, title, sub, bg }) => (
                <div key={title} className={`flex flex-col items-center gap-2 border-2 border-black p-3 ${bg} text-center`}>
                  <Icon className="w-5 h-5" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tighter">{title}</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors self-start"
            >
              <Share2 className="w-4 h-4" />
              Share via WhatsApp
            </button>
          </div>
        </div>

        {/* ── DETAILS TABS (Accordion) ── */}
        <div className="mt-14 border-t-4 border-black pt-8">
          <Accordion type="multiple" defaultValue={["description", "specs"]} className="w-full">

            {/* Description */}
            <AccordionItem value="description" className="border-2 border-black mb-2">
              <AccordionTrigger className="font-black uppercase tracking-widest hover:no-underline px-5 hover:bg-yellow-50 transition-colors text-sm">
                Description
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <div className="font-bold text-gray-700 leading-relaxed text-sm border-l-4 border-yellow-400 pl-4 mb-4">
                  <RichTextContent html={product.description} />
                </div>
                {product.highlights && (
                  <ul className="space-y-2 mt-3">
                    {product.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm font-bold text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Technical Specs */}
            {product.specs && (
              <AccordionItem value="specs" className="border-2 border-black mb-2">
                <AccordionTrigger className="font-black uppercase tracking-widest hover:no-underline px-5 hover:bg-yellow-50 transition-colors text-sm">
                  Technical Specifications
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <div className="border-2 border-black overflow-hidden">
                    {Object.entries(product.specs).map(([key, value], i) => (
                      <div
                        key={key}
                        className={`flex items-start gap-4 px-4 py-3 ${
                          i % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } ${i < Object.keys(product.specs!).length - 1 ? "border-b border-gray-100" : ""}`}
                      >
                        <span className="font-black uppercase text-[10px] tracking-widest text-gray-400 w-40 shrink-0 pt-0.5">
                          {key}
                        </span>
                        <span className="font-bold text-sm text-gray-800 flex-1">{value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Shipping & Returns */}
            <AccordionItem value="shipping" className="border-2 border-black mb-2">
              <AccordionTrigger className="font-black uppercase tracking-widest hover:no-underline px-5 hover:bg-yellow-50 transition-colors text-sm">
                Shipping & Returns
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-black p-4 bg-blue-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span className="font-black uppercase text-xs tracking-widest">Delivery</span>
                    </div>
                    <ul className="space-y-2 text-sm font-bold text-gray-600">
                      <li>• Free delivery in Nairobi on orders over KSh 3,000</li>
                      <li>• Standard delivery: 1–3 business days (KSh 300)</li>
                      <li>• Same-day delivery available in select areas</li>
                      <li>• Upcountry: 3–7 business days (varies)</li>
                    </ul>
                  </div>
                  <div className="border-2 border-black p-4 bg-orange-50">
                    <div className="flex items-center gap-2 mb-3">
                      <RefreshCcw className="w-5 h-5 text-orange-600" />
                      <span className="font-black uppercase text-xs tracking-widest">Returns</span>
                    </div>
                    <ul className="space-y-2 text-sm font-bold text-gray-600">
                      <li>• 14-day free return window</li>
                      <li>• Item must be unused in original packaging</li>
                      <li>• Refund processed within 3–5 business days</li>
                      <li>• Exchanges available for size/colour</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Product Info */}
            <AccordionItem value="info" className="border-2 border-black">
              <AccordionTrigger className="font-black uppercase tracking-widest hover:no-underline px-5 hover:bg-yellow-50 transition-colors text-sm">
                Product Information
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "SKU", value: product.sku },
                    { label: "Brand", value: product.brand ?? "—" },
                    { label: "Category", value: product.category },
                    { label: "Subcategory", value: product.subCategory },
                    { label: "Stock", value: `${product.stock} units` },
                    { label: "Tags", value: product.tags?.join(", ") ?? "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="border-2 border-black p-3 bg-gray-50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                      <p className="text-sm font-bold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <section className="mt-14 pt-8 border-t-4 border-black">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  More from {product.category}
                </p>
                <h2 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter">
                  You Might Also Like
                </h2>
              </div>
              <Link
                href={`/products/category/${product.categorySlug}`}
                className="inline-flex items-center gap-1 font-bold uppercase text-xs tracking-widest hover:underline decoration-2 decoration-yellow-400"
              >
                View All <Package className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
