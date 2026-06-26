"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Star,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ui/product-card";
import type { Product } from "@/lib/map-product";
import { CATEGORIES } from "@/lib/data/categories";

const PRODUCTS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
];

export function ProductsContent({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";

  const maxPrice = useMemo(
    () => Math.max(500, ...products.map((p) => p.price)),
    [products]
  );

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [minRating, setMinRating] = useState(0);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([initialCategory]);

  const toggleCategory = useCallback((slug: string) => {
    setExpandedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const handleCategorySelect = (catSlug: string) => {
    setSelectedCategory(catSlug === selectedCategory ? "" : catSlug);
    setSelectedSubcategory("");
    setCurrentPage(1);
  };

  const handleSubcategorySelect = (subSlug: string) => {
    setSelectedSubcategory(subSlug === selectedSubcategory ? "" : subSlug);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setPriceRange([0, maxPrice]);
    setMinRating(0);
    setOnSaleOnly(false);
    setInStockOnly(false);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.includes(q))
      );
    }
    if (selectedCategory) {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }
    if (selectedSubcategory) {
      result = result.filter((p) => p.subCategorySlug === selectedSubcategory);
    }
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }
    if (onSaleOnly) {
      result = result.filter((p) => p.isOnSale);
    }
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    priceRange,
    minRating,
    onSaleOnly,
    inStockOnly,
    sortBy,
  ]);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const activeFilterCount = [
    selectedCategory,
    selectedSubcategory,
    priceRange[0] > 0 || priceRange[1] < maxPrice,
    minRating > 0,
    onSaleOnly,
    inStockOnly,
  ].filter(Boolean).length;

  const activeCategoryData = CATEGORIES.find((c) => c.slug === selectedCategory);

  const SidebarContent = () => (
    <div className="space-y-6">
      <div>
        <p className="font-black uppercase text-xs tracking-widest mb-3 border-b-2 border-black pb-2">
          Search
        </p>
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search products..."
            className="rounded-none border-2 border-black font-bold text-sm pr-8"
          />
          <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div>
        <p className="font-black uppercase text-xs tracking-widest mb-3 border-b-2 border-black pb-2">
          Categories
        </p>
        <div className="space-y-1">
          <button
            onClick={() => { setSelectedCategory(""); setSelectedSubcategory(""); setCurrentPage(1); }}
            className={`w-full text-left px-3 py-2 text-sm font-bold transition-colors ${
              !selectedCategory ? "bg-black text-white" : "hover:bg-yellow-100"
            }`}
          >
            All Products ({products.length})
          </button>
          {CATEGORIES.map((cat) => {
            const catCount = products.filter((p) => p.categorySlug === cat.slug).length;
            if (catCount === 0) return null;
            const isExpanded = expandedCategories.includes(cat.slug);
            const isActive = selectedCategory === cat.slug;
            return (
              <div key={cat.slug}>
                <div className="flex items-center">
                  <button
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`flex-1 text-left px-3 py-2 text-sm font-bold transition-colors flex items-center gap-2 ${
                      isActive ? "bg-indigo-600 text-white" : "hover:bg-yellow-100"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="flex-1">{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${isActive ? "bg-white/20" : "bg-gray-100"}`}>
                      {catCount}
                    </span>
                  </button>
                  {cat.subcategories.some((s) =>
                    products.some((p) => p.subCategorySlug === s.slug)
                  ) && (
                    <button
                      onClick={() => toggleCategory(cat.slug)}
                      className="px-2 py-2 hover:bg-gray-100 border-l border-gray-200"
                    >
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>
                {isExpanded && (
                  <div className="ml-4 border-l-2 border-gray-200 pl-2 space-y-0.5 mt-0.5">
                    {cat.subcategories.map((sub) => {
                      const subCount = products.filter((p) => p.subCategorySlug === sub.slug).length;
                      if (subCount === 0) return null;
                      return (
                        <button
                          key={sub.slug}
                          onClick={() => {
                            setSelectedCategory(cat.slug);
                            handleSubcategorySelect(sub.slug);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-bold transition-colors flex justify-between ${
                            selectedSubcategory === sub.slug
                              ? "bg-yellow-300 text-black"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <span>{sub.name}</span>
                          <span className="text-gray-400">{subCount}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="font-black uppercase text-xs tracking-widest mb-3 border-b-2 border-black pb-2">
          Price Range
        </p>
        <div className="px-2 space-y-4">
          <Slider
            min={0}
            max={maxPrice}
            step={10}
            value={priceRange}
            onValueChange={(v) => { setPriceRange(v); setCurrentPage(1); }}
            className="w-full"
          />
          <div className="flex justify-between text-sm font-black">
            <span>KSh {priceRange[0].toLocaleString()}</span>
            <span>KSh {priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="font-black uppercase text-xs tracking-widest mb-3 border-b-2 border-black pb-2">
          Min Rating
        </p>
        <div className="space-y-1">
          {[0, 3, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => { setMinRating(r); setCurrentPage(1); }}
              className={`w-full text-left px-3 py-2 text-sm font-bold transition-colors flex items-center gap-2 ${
                minRating === r ? "bg-yellow-300 border-l-4 border-yellow-500" : "hover:bg-gray-50"
              }`}
            >
              {r === 0 ? (
                <span>All Ratings</span>
              ) : (
                <>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= r ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span>{r}+ stars</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-black uppercase text-xs tracking-widest mb-3 border-b-2 border-black pb-2">
          Availability
        </p>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={onSaleOnly}
              onChange={(e) => { setOnSaleOnly(e.target.checked); setCurrentPage(1); }}
              className="w-4 h-4 border-2 border-black accent-black"
            />
            <span className="text-sm font-bold group-hover:text-indigo-600">On Sale Only</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => { setInStockOnly(e.target.checked); setCurrentPage(1); }}
              className="w-4 h-4 border-2 border-black accent-black"
            />
            <span className="text-sm font-bold group-hover:text-indigo-600">In Stock Only</span>
          </label>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button
          onClick={clearAllFilters}
          variant="outline"
          className="w-full rounded-none border-2 border-black font-black uppercase text-xs tracking-widest"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* PAGE HEADER */}
      <div className="bg-black text-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl lg:text-6xl font-black uppercase italic tracking-tighter">
            {activeCategoryData ? activeCategoryData.name : "All Products"}
          </h1>
          <p className="font-bold text-gray-400 uppercase text-xs tracking-widest mt-2">
            {filtered.length} products found
            {activeCategoryData && ` in ${activeCategoryData.name}`}
          </p>
        </div>
      </div>

      {/* ACTIVE FILTER CHIPS */}
      {activeFilterCount > 0 && (
        <div className="border-b-2 border-black bg-yellow-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-gray-500">
              Active Filters:
            </span>
            {selectedCategory && (
              <Badge
                onClick={() => { setSelectedCategory(""); setSelectedSubcategory(""); }}
                className="rounded-none border-2 border-black bg-indigo-100 text-black font-bold cursor-pointer hover:bg-red-100 flex items-center gap-1"
              >
                {CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {selectedSubcategory && activeCategoryData && (
              <Badge
                onClick={() => setSelectedSubcategory("")}
                className="rounded-none border-2 border-black bg-yellow-200 text-black font-bold cursor-pointer hover:bg-red-100 flex items-center gap-1"
              >
                {activeCategoryData.subcategories.find((s) => s.slug === selectedSubcategory)?.name}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <Badge
                onClick={() => setPriceRange([0, maxPrice])}
                className="rounded-none border-2 border-black bg-green-100 text-black font-bold cursor-pointer hover:bg-red-100 flex items-center gap-1"
              >
                KSh {priceRange[0]}–{priceRange[1]}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {minRating > 0 && (
              <Badge
                onClick={() => setMinRating(0)}
                className="rounded-none border-2 border-black bg-orange-100 text-black font-bold cursor-pointer hover:bg-red-100 flex items-center gap-1"
              >
                {minRating}+ Stars
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {onSaleOnly && (
              <Badge
                onClick={() => setOnSaleOnly(false)}
                className="rounded-none border-2 border-black bg-red-100 text-black font-bold cursor-pointer hover:bg-red-200 flex items-center gap-1"
              >
                On Sale <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {inStockOnly && (
              <Badge
                onClick={() => setInStockOnly(false)}
                className="rounded-none border-2 border-black bg-cyan-100 text-black font-bold cursor-pointer hover:bg-red-100 flex items-center gap-1"
              >
                In Stock <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* SIDEBAR — DESKTOP */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 border-2 border-black p-5 bg-white max-h-[calc(100vh-7rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black uppercase tracking-widest text-sm">Filters</h2>
                {activeFilterCount > 0 && (
                  <Badge className="rounded-full bg-black text-white font-black text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
              <SidebarContent />
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-black">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setSidebarOpen(true)}
                  variant="outline"
                  className="lg:hidden rounded-none border-2 border-black font-black uppercase text-xs tracking-widest"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  {filtered.length} results
                </span>
              </div>

              <div className="flex items-center gap-2 border-2 border-black">
                <ArrowUpDown className="w-4 h-4 ml-2 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="font-black text-xs uppercase tracking-widest py-2 pr-3 bg-white focus:outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PRODUCT GRID */}
            {paginated.length === 0 ? (
              <div className="text-center py-24 border-4 border-dashed border-gray-200">
                <p className="text-6xl mb-4">🔍</p>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
                  No Products Found
                </h3>
                <p className="font-bold text-gray-400 text-sm uppercase tracking-widest mb-6">
                  Try adjusting your filters
                </p>
                <Button
                  onClick={clearAllFilters}
                  className="rounded-none border-2 border-black bg-black text-white font-black uppercase"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-1">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="rounded-none border-2 border-black font-black uppercase text-xs disabled:opacity-40"
                >
                  Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-none border-2 border-black font-black w-10 ${
                      currentPage === page
                        ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(254,240,138,1)]"
                        : "bg-white text-black hover:bg-yellow-100"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="rounded-none border-2 border-black font-black uppercase text-xs disabled:opacity-40"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR DRAWER */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white border-l-4 border-black overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b-2 border-black sticky top-0 bg-white z-10">
              <h2 className="font-black uppercase tracking-widest text-lg">Filters</h2>
              <Button
                onClick={() => setSidebarOpen(false)}
                variant="outline"
                size="icon"
                className="rounded-none border-2 border-black"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-5">
              <SidebarContent />
            </div>
            <div className="p-5 border-t-2 border-black sticky bottom-0 bg-white space-y-2">
              {activeFilterCount > 0 && (
                <Button
                  onClick={() => { clearAllFilters(); setSidebarOpen(false); }}
                  variant="outline"
                  className="w-full rounded-none border-2 border-black font-black uppercase tracking-widest"
                >
                  View All Products ({products.length})
                </Button>
              )}
              <Button
                onClick={() => setSidebarOpen(false)}
                className="w-full rounded-none bg-black text-white font-black uppercase tracking-widest border-2 border-black"
              >
                View {filtered.length} Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
