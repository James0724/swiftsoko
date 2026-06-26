import Link from "next/link";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { CategorySidebar } from "@/components/ui/category-sidebar";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Headphones,
  Star,
  Zap,
  Tag,
  TrendingUp,
} from "lucide-react";
import { CATEGORIES } from "@/lib/data/categories";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/map-product";

export const dynamic = "force-dynamic";

const CATEGORY_IMAGES: Record<string, string> = {
  electronics:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600",
  fashion:
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600",
  "health-beauty":
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600",
  "home-living":
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600",
  "sports-fitness":
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600",
  "grocery-food":
    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600",
  "baby-kids":
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600",
  automotive:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600",
};

export default async function Home() {
  const rows = await prisma.product.findMany({
    include: { category: true, subCategory: true },
    orderBy: { createdAt: "desc" },
  });
  const allProducts = rows.map(mapProduct);

  const FEATURED = allProducts.filter((p) => p.sections.includes("FEATURED")).slice(0, 4);
  const ON_SALE = allProducts.filter((p) => p.sections.includes("FLASH_DEALS")).slice(0, 4);
  const NEW_ARRIVALS = allProducts.filter((p) => p.isNew).slice(0, 4);
  const TOP_RATED = allProducts.filter((p) => p.sections.includes("TOP_RATED")).slice(0, 4);

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* FLASH SALE BAR */}
      <div className="bg-yellow-300 border-b-4 border-black p-2 overflow-hidden">
        <div className="container mx-auto flex items-center justify-center gap-4">
          <Clock className="w-5 h-5 shrink-0" />
          <p className="font-black uppercase italic tracking-tighter text-xs md:text-sm animate-pulse">
            FLASH SALE: 08H : 42M : 12S REMAINING — USE CODE &quot;BOLT40&quot;
            FOR 40% OFF
          </p>
        </div>
      </div>

      {/* HERO GRID */}
      <section className="border-b-4 border-black grid grid-cols-1 lg:grid-cols-[260px_1fr] h-[520px]">
        {/* LEFT: CATEGORY LIST */}
        <CategorySidebar />

        {/* CENTER: MAIN HERO BANNER */}
        <div className="relative bg-red-700 overflow-hidden flex flex-col md:flex-row">
          {/* Background layers */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-red-800/40 [clip-path:polygon(18%_0%,100%_0%,100%_100%,0%_100%)]" />

          {/* LEFT: TEXT CONTENT */}
          <div className="relative z-10 p-8 md:p-14 flex flex-col justify-center text-white md:w-[48%]">
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400 text-black px-2 py-0.5 font-black uppercase text-[10px] tracking-tighter">
                  Limited Drop
                </span>
                <span className="font-black uppercase text-[10px] tracking-widest text-white/60">
                  ⚡ Inventory: Low
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black uppercase italic tracking-tighter leading-[0.9]">
                Jijenge <br />
                <span className="text-yellow-400">ESSENTIALS</span> <br />
                Swiftsoko
              </h1>

              <div className="border-l-4 border-yellow-400 pl-4">
                <p className="font-black text-xl md:text-2xl uppercase italic leading-none">
                  Up to 40% Off Select Items
                </p>
                <p className="mt-1 max-w-sm font-bold text-yellow-200 uppercase text-[10px] tracking-tight">
                  High-performance products. Fast delivery. Grab yours before
                  stock clears.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/products">
                  <Button className="group rounded-none bg-yellow-400 text-black border-4 border-black font-black uppercase text-sm px-7 py-5 hover:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    Shop All
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link href="/products?sale=true">
                  <Button
                    variant="outline"
                    className="rounded-none border-2 border-white/60 px-7 py-5 font-black uppercase text-sm bg-transparent text-white hover:bg-white hover:text-black transition-all"
                  >
                    Today&apos;s Deals
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-8 border-t border-white/20 pt-5">
              <div>
                <p className="font-black text-2xl text-yellow-400">12k+</p>
                <p className="text-[10px] font-bold uppercase text-white/60">
                  Orders Shipped
                </p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="font-black text-2xl text-yellow-400">4.9/5</p>
                <p className="text-[10px] font-bold uppercase text-white/60">
                  Rating
                </p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="font-black text-2xl text-yellow-400">500+</p>
                <p className="text-[10px] font-bold uppercase text-white/60">
                  Products
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT IMAGE */}
          <div className="relative flex-1 flex items-center justify-center p-6 md:p-8">
            <div className="absolute top-6 left-6 z-20 bg-yellow-400 border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-black uppercase text-xs tracking-tight">
                -40% OFF
              </p>
            </div>
            <img
              src="https://res.cloudinary.com/dqhx4szwr/image/upload/v1769233008/100014519_zabj4x.webp"
              alt="Featured Products"
              className="relative z-10 w-full max-w-sm h-auto object-contain drop-shadow-[12px_12px_0px_rgba(0,0,0,0.5)]"
            />
            <Link href="/products" className="absolute bottom-6 right-6 z-20">
              <Button className="bg-white text-black border-4 border-black rounded-none font-black uppercase text-base px-7 py-4 hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                SHOP NOW
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS BAR */}
      <section className="bg-black text-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              {
                icon: Truck,
                title: "Free Delivery",
                sub: "On orders over KSh 3,000",
              },
              {
                icon: ShieldCheck,
                title: "Secure Payment",
                sub: "M-Pesa, Card & Cash",
              },
              {
                icon: RefreshCcw,
                title: "Easy Returns",
                sub: "14-day return policy",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                sub: "Always here to help",
              },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-4 py-4 px-6">
                <Icon className="w-6 h-6 text-yellow-400 shrink-0" />
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">
                    {title}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-6 border-b-4 border-black pb-2">
          <h2 className="text-2xl lg:text-4xl font-black uppercase italic tracking-tighter">
            Shop by Category
          </h2>
          <Link
            href="/products"
            className="font-bold uppercase text-sm flex items-center gap-2 hover:underline decoration-2 decoration-yellow-400"
          >
            All Categories <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-2 border-2 border-black p-3 hover:bg-yellow-300 hover:border-yellow-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-center"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="font-black uppercase text-[10px] tracking-tight leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ADVERTISEMENT BANNER 1 — Wide Promo */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href={`/shop?category=electronics`}
            className="relative bg-indigo-950 border-4 border-black overflow-hidden group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="p-8 text-white relative z-10">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-300">
                Best Sellers
              </span>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mt-1 mb-2">
                Electronics <br />
                <span className="text-yellow-400">Up to 30% Off</span>
              </h3>
              <p className="font-bold text-sm text-gray-300 mb-4">
                Phones, laptops, wearables & more
              </p>
              <Button className="rounded-none bg-yellow-400 text-black border-2 border-black font-black uppercase text-xs px-6 py-2 hover:bg-yellow-300">
                Shop Electronics <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </div>
            <img
              src={CATEGORY_IMAGES["electronics"]}
              alt="Electronics"
              className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-30 group-hover:opacity-40 transition-opacity"
            />
          </Link>

          <Link
            href={`/shop?category=fashion`}
            className="relative bg-pink-600 border-4 border-black overflow-hidden group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="p-8 text-white relative z-10">
              <span className="text-xs font-black uppercase tracking-widest text-pink-200">
                New Season
              </span>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mt-1 mb-2">
                Fashion <br />
                <span className="text-yellow-300">New Arrivals</span>
              </h3>
              <p className="font-bold text-sm text-pink-100 mb-4">
                Clothing, shoes, bags & accessories
              </p>
              <Button className="rounded-none bg-white text-black border-2 border-black font-black uppercase text-xs px-6 py-2 hover:bg-yellow-300">
                Shop Fashion <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </div>
            <img
              src={CATEGORY_IMAGES["fashion"]}
              alt="Fashion"
              className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-25 group-hover:opacity-35 transition-opacity"
            />
          </Link>
        </div>
      </section>

      {/* FLASH DEALS */}
      <section className="border-y-4 border-black bg-red-700 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-4">
              <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              <div>
                <h2 className="text-3xl lg:text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                  Flash Deals
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="font-black text-yellow-400 uppercase text-xs tracking-widest">
                    Ends in: 08:42:12
                  </span>
                </div>
              </div>
            </div>
            <Link href="/products?sale=true">
              <Button className="rounded-none border-2 border-white bg-transparent text-white font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all">
                All Deals <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {ON_SALE.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED INVENTORY */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-6 border-b-4 border-black pb-2">
          <div className="flex items-center gap-3">
            <Tag className="w-6 h-6" />
            <h2 className="text-2xl lg:text-4xl font-black uppercase italic tracking-tighter">
              Featured Products
            </h2>
          </div>
          <Link
            href="/products"
            className="font-bold uppercase text-sm flex items-center gap-2 hover:underline decoration-2 decoration-yellow-400"
          >
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {FEATURED.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ADVERTISEMENT BANNER 2 — Full Width */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <Link href="/shop?category=sports-fitness" className="block">
          <div className="relative bg-orange-500 border-4 border-black overflow-hidden group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="p-8 md:p-12 text-white">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1">
                  New Season
                </span>
                <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mt-3 mb-3 leading-tight">
                  Sports &amp; <br />
                  <span className="text-yellow-300">Fitness</span> <br />
                  Gear
                </h3>
                <p className="font-bold text-orange-100 mb-6 text-sm">
                  Level up your workout with premium equipment and sportswear.
                  Up to 25% off for a limited time.
                </p>
                <Button className="rounded-none bg-black text-white border-2 border-black font-black uppercase px-8 py-3 hover:bg-yellow-400 hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
                  Shop Sports <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="hidden md:block relative h-64 md:h-80">
                <img
                  src={CATEGORY_IMAGES["sports-fitness"]}
                  alt="Sports & Fitness"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-orange-500" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* TOP RATED */}
      <section className="bg-gray-50 border-y-4 border-black py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-6 border-b-4 border-black pb-2">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <h2 className="text-2xl lg:text-4xl font-black uppercase italic tracking-tighter">
                Top Rated
              </h2>
            </div>
            <Link
              href="/products?sort=rating"
              className="font-bold uppercase text-sm flex items-center gap-2 hover:underline decoration-2 decoration-yellow-400"
            >
              See All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            {TOP_RATED.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* THREE-COLUMN AD BANNERS */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Ad 1 */}
          <Link
            href="/shop?category=health-beauty"
            className="relative bg-green-100 border-4 border-black p-6 group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden"
          >
            <span className="text-4xl">💄</span>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mt-3 mb-1">
              Health & Beauty
            </h3>
            <p className="text-sm font-bold text-gray-600 mb-4">
              Skincare, hair care, fragrances & wellness essentials
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-green-700 border-b-2 border-green-700">
              Shop Now <ArrowRight className="w-3 h-3" />
            </span>
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">
              💄
            </div>
          </Link>

          {/* Ad 2 */}
          <Link
            href="/shop?category=home-living"
            className="relative bg-cyan-100 border-4 border-black p-6 group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden"
          >
            <span className="text-4xl">🏠</span>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mt-3 mb-1">
              Home & Living
            </h3>
            <p className="text-sm font-bold text-gray-600 mb-4">
              Furniture, kitchen essentials, bedding & home décor
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-cyan-700 border-b-2 border-cyan-700">
              Shop Now <ArrowRight className="w-3 h-3" />
            </span>
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">
              🏠
            </div>
          </Link>

          {/* Ad 3 */}
          <Link
            href="/shop?category=baby-kids"
            className="relative bg-purple-100 border-4 border-black p-6 group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden"
          >
            <span className="text-4xl">🧸</span>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mt-3 mb-1">
              Baby & Kids
            </h3>
            <p className="text-sm font-bold text-gray-600 mb-4">
              Toys, games, baby care & kids' clothing
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-purple-700 border-b-2 border-purple-700">
              Shop Now <ArrowRight className="w-3 h-3" />
            </span>
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">
              🧸
            </div>
          </Link>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-end mb-6 border-b-4 border-black pb-2">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-2xl lg:text-4xl font-black uppercase italic tracking-tighter">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/products?sort=newest"
            className="font-bold uppercase text-sm flex items-center gap-2 hover:underline decoration-2 decoration-yellow-400"
          >
            All New <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {NEW_ARRIVALS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* BRAND / VENDOR ADVERTISEMENT STRIP */}
      <section className="border-y-4 border-black bg-yellow-300 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center font-black uppercase text-xs tracking-[0.4em] mb-6 text-black/60">
            Official Brand Stores
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              "SwiftWear",
              "SoundSwift",
              "FitSwift",
              "GameSwift",
              "TechSwift",
              "HomeSwift",
              "GlowSwift",
              "SwiftRun",
            ].map((brand) => (
              <Link
                key={brand}
                href={`/shop?brand=${brand}`}
                className="bg-white border-4 border-black px-6 py-3 font-black uppercase text-sm tracking-widest hover:bg-black hover:text-white transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FULL-WIDTH NEWSLETTER */}
      <section className="bg-indigo-950 border-b-4 border-black py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">
            Join 50,000+ Smart Shoppers
          </span>
          <h2 className="text-4xl lg:text-6xl font-black uppercase italic tracking-tighter text-white mt-2 mb-3">
            Get Deals <span className="text-yellow-400">First</span>
          </h2>
          <p className="font-bold text-gray-400 text-sm mb-8">
            Subscribe for exclusive offers, flash sale alerts, and early access
            to new drops.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 border-4 border-white/20 bg-white/10 text-white placeholder:text-white/40 font-bold px-4 py-3 focus:outline-none focus:border-yellow-400"
            />
            <Button className="rounded-none border-4 border-yellow-400 bg-yellow-400 text-black font-black uppercase tracking-widest px-8 py-3 hover:bg-yellow-300 hover:border-yellow-300 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] h-full">
              Subscribe
            </Button>
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
