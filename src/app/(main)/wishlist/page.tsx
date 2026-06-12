"use client";

import Link from "next/link";
import { Heart, Trash2, ShoppingCart, ArrowLeft, Star, Tag } from "lucide-react";
import { useWishlistStore } from "@/store/use-wishlist-store";
import { useCartStore } from "@/store/use-cart-store";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({
      id: parseInt(item.id),
      name: item.name,
      price: item.price,
      img: item.image,
      qty: 1,
    });
    removeItem(item.id);
    toast.success(`${item.name} moved to cart`);
  };

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    toast.info(`${name} removed from wishlist`);
  };

  return (
    <main className="min-h-screen bg-[#F0F0F0] pb-20">
      {/* Header */}
      <div className="bg-indigo-950 border-b-4 border-black">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Link href="/shop" className="inline-flex items-center gap-2 text-white/60 hover:text-white font-bold text-xs uppercase tracking-widest mb-4 transition-colors">
            <ArrowLeft size={14} strokeWidth={3} /> Continue Shopping
          </Link>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="bg-red-400 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Heart size={28} strokeWidth={3} className="text-white fill-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Wishlist</h1>
                <p className="text-white/60 font-bold text-xs uppercase tracking-widest">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            {items.length > 0 && (
              <button
                onClick={() => { clearWishlist(); toast.info("Wishlist cleared"); }}
                className="flex items-center gap-2 px-4 py-2.5 border-4 border-white/30 text-white/60 hover:border-white hover:text-white font-black uppercase text-xs transition-colors"
              >
                <Trash2 size={14} strokeWidth={3} /> Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-20 text-center">
            <div className="inline-block p-6 border-4 border-black bg-red-100 mb-6 rotate-3">
              <Heart size={64} strokeWidth={2} className="text-red-400" />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-3">Nothing Saved Yet</h2>
            <p className="font-bold text-sm text-gray-500 uppercase tracking-widest mb-8 max-w-xs mx-auto">
              Browse the shop and hit the heart icon to save items you love.
            </p>
            <Link href="/shop" className="inline-block bg-yellow-300 border-4 border-black px-10 py-4 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <div key={item.id} className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group">
                {/* Image */}
                <div className="relative aspect-square border-b-4 border-black overflow-hidden">
                  <Link href={`/products/${item.id}`}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                  {item.isOnSale && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 border-2 border-black font-black text-[10px] uppercase">
                      Sale
                    </div>
                  )}
                  <button
                    onClick={() => handleRemove(item.id, item.name)}
                    className="absolute top-3 right-3 w-9 h-9 bg-white border-2 border-black flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-300 transition-all"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={14} strokeWidth={3} />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-1">
                    <Tag size={10} /> {item.category}
                  </p>
                  <Link href={`/products/${item.id}`}>
                    <h3 className="font-black text-base leading-tight hover:text-indigo-600 transition-colors mb-2">{item.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={10} className={s <= Math.round(item.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">{item.rating}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-black text-lg">KSh {item.price.toLocaleString()}</span>
                    {item.originalPrice && (
                      <span className="font-bold text-sm text-gray-400 line-through">KSh {item.originalPrice.toLocaleString()}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-300 border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                    >
                      <ShoppingCart size={14} strokeWidth={3} /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="w-12 flex items-center justify-center border-4 border-black hover:bg-red-300 transition-colors"
                      title="Remove"
                    >
                      <Heart size={16} strokeWidth={3} className="fill-red-500 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-8 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-bold uppercase text-sm text-gray-600">
              {items.length} item{items.length !== 1 ? "s" : ""} · Total value:{" "}
              <span className="font-black text-black">KSh {items.reduce((s, i) => s + i.price, 0).toLocaleString()}</span>
            </p>
            <button
              onClick={() => { items.forEach((item) => addToCart({ id: parseInt(item.id), name: item.name, price: item.price, img: item.image, qty: 1 })); clearWishlist(); toast.success("All items moved to cart!"); }}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-950 text-white border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <ShoppingCart size={16} strokeWidth={3} /> Move All to Cart
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
