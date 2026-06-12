"use client";

import { useState } from "react";
import { X, Filter, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 500]);

  const categories = [
    "Outerwear",
    "Heavy Cotton",
    "Accessories",
    "Footwear",
    "Headwear",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <aside className="w-full lg:w-64 flex flex-col gap-8">
      {/* HEADER WITH TOTAL RESULTS */}
      <div className="border-4 border-black bg-black text-white p-4 shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-black uppercase italic text-xl tracking-tighter">
            Filters
          </h3>
          <SlidersHorizontal className="w-5 h-5 text-yellow-300" />
        </div>
        <p className="font-mono text-[10px] uppercase text-gray-400">
          Items Found: 128
        </p>
      </div>

      {/* CATEGORY SECTION */}
      <div className="space-y-4">
        <h4 className="font-black uppercase text-sm tracking-widest border-b-2 border-black pb-1">
          Department
        </h4>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <Checkbox className="rounded-none border-2 border-black data-[state=checked]:bg-blue-600 data-[state=checked]:text-white w-5 h-5" />
              <span className="font-bold uppercase text-xs group-hover:translate-x-1 transition-transform">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* PRICE RANGE SECTION */}
      <div className="space-y-6">
        <h4 className="font-black uppercase text-sm tracking-widest border-b-2 border-black pb-1">
          Price Limit
        </h4>
        <div className="px-2">
          <Slider
            defaultValue={[0, 500]}
            max={1000}
            step={10}
            className="**:[[role=slider]]:bg-black *:[[role=slider]]:rounded-none **:[[role=slider]]:border-2 **:[[role=slider]]:border-yellow-300"
            onValueChange={(val) => setPriceRange(val)}
          />
          <div className="flex justify-between mt-4">
            <div className="border-2 border-black px-2 py-1 font-black text-xs bg-gray-50">
              ${priceRange[0]}
            </div>
            <div className="border-2 border-black px-2 py-1 font-black text-xs bg-gray-50">
              ${priceRange[1]}
            </div>
          </div>
        </div>
      </div>

      {/* SIZE GRID */}
      <div className="space-y-4">
        <h4 className="font-black uppercase text-sm tracking-widest border-b-2 border-black pb-1">
          Size
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              className="border-2 border-black py-2 font-black text-xs hover:bg-black hover:text-white transition-all active:bg-yellow-300 active:text-black focus:bg-black focus:text-white"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* CLEAR ALL BUTTON */}
      <Button
        variant="ghost"
        className="rounded-none border-2 border-dashed border-gray-300 text-gray-400 font-bold uppercase text-[10px] hover:border-black hover:text-black mt-4"
      >
        Reset All Filters
      </Button>

      {/* PROMO CARD INSIDE SIDEBAR */}
      <div className="mt-4 border-2 border-black bg-blue-50 p-4 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="font-black italic uppercase text-lg leading-tight">
            Join the <br /> Club
          </p>
          <p className="text-[9px] font-bold uppercase mt-2">
            Get 10% off your first order
          </p>
          <button className="mt-3 text-[10px] font-black uppercase underline decoration-2">
            Learn More
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform">
          <Filter className="w-20 h-20" />
        </div>
      </div>
    </aside>
  );
}
