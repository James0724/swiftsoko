"use client";

import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/use-cart-store";

export function CartDrawer() {
  const { isOpen, closeCart, items, increaseQty, decreaseQty, removeItem } = useCartStore();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const freeShippingThreshold = 500;
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent
        showCloseButton={false}
        className="w-full sm:max-w-md p-0 gap-0 border-l-4 border-black flex flex-col"
      >
        {/* HEADER */}
        <SheetHeader className="p-6 border-b-4 border-black bg-white">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-2">
              <ShoppingBag className="w-8 h-8" /> Cart
            </SheetTitle>
            <Button
              variant="ghost"
              onClick={closeCart}
              className="rounded-none border-2 border-black p-1 h-8 w-8"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </SheetHeader>

        {/* FREE SHIPPING PROGRESS */}
        <div className="bg-yellow-300 p-4 border-b-2 border-black">
          <div className="flex justify-between items-center mb-2">
            <p className="font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
              <Truck className="w-4 h-4" />
              {subtotal < freeShippingThreshold
                ? `Add $${freeShippingThreshold - subtotal} for free shipping`
                : "Free Shipping Unlocked"}
            </p>
            <span className="font-bold text-[10px]">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 border-2 border-black bg-white">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
            <div className="w-24 h-24 border-4 border-dashed border-gray-200 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-200" />
            </div>
            <h3 className="font-black uppercase italic text-2xl tracking-tighter">
              Your Bag is Empty
            </h3>
            <Button
              onClick={closeCart}
              className="w-full rounded-none bg-black text-white h-16 font-black uppercase"
            >
              Start Hunting
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-24 h-24 border-2 border-black shrink-0 bg-gray-100 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black uppercase italic text-sm tracking-tighter leading-none">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex border-2 border-black h-8 items-center">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-2 hover:bg-gray-100 border-r-2 border-black h-full"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 font-black text-xs">{item.qty}</span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-2 hover:bg-gray-100 border-l-2 border-black h-full"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-black text-lg italic">${item.price * item.qty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CHECKOUT FOOTER */}
        <SheetFooter className="p-6 border-t-4 border-black bg-gray-50 flex-col sm:flex-col gap-4">
          <div className="space-y-2 w-full">
            <div className="flex justify-between font-bold uppercase text-xs">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between font-black uppercase text-xl italic tracking-tighter">
              <span>Total Est.</span>
              <span className="text-blue-600">${subtotal}</span>
            </div>
          </div>

          <Button className="w-full h-12 rounded-none bg-black text-white font-black uppercase tracking-[0.2em] text-lg shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            Secure Checkout <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-[9px] text-center font-bold text-gray-400 uppercase tracking-widest">
            Tax and shipping calculated at final step
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
