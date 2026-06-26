"use client";

import { Heart, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Product } from "@/lib/map-product";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const { name, price, originalPrice, category, image, isNew, isOnSale, slug, rating, reviews } = product;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="group relative bg-white border-2 border-black rounded-none transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1">
      <Link href={`/products/${slug}`}>
        <div className="relative aspect-square border-b-2 border-black overflow-hidden bg-gray-100">
          {isNew && (
            <Badge className="absolute top-3 left-3 z-10 rounded-none border-2 border-black bg-yellow-300 text-black font-black uppercase text-[10px] px-2 py-1">
              New Drop
            </Badge>
          )}
          {isOnSale && !isNew && discount > 0 && (
            <Badge className="absolute top-3 left-3 z-10 rounded-none border-2 border-black bg-red-600 text-white font-black uppercase text-[10px] px-2 py-1">
              -{discount}%
            </Badge>
          )}
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-500 scale-105 group-hover:scale-100"
          />
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <Link href={`/products/${slug}`}>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {category}
            </p>
            <h3 className="font-black uppercase italic text-base tracking-tighter leading-tight hover:text-indigo-600 transition-colors line-clamp-2">
              {name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"}`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-gray-400">({reviews})</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="font-black text-xl italic">KSh {price.toLocaleString()}</p>
              {originalPrice && (
                <p className="font-bold text-sm text-gray-400 line-through">KSh {originalPrice.toLocaleString()}</p>
              )}
            </div>
          </div>
        </Link>

        <Button
          className="w-full rounded-none border-2 border-black bg-white text-black font-black uppercase hover:bg-black hover:text-white transition-all py-6 active:translate-y-1 active:shadow-none text-xs"
          onClick={(e) => {
            e.preventDefault();
            addItem({ ...product, img: product.image } as any);
          }}
        >
          Add to Bag <Plus className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <button className="absolute top-3 right-3 z-10 bg-white border-2 border-black p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-500 hover:text-red-500">
        <Heart className="w-4 h-4" />
      </button>
    </div>
  );
}
