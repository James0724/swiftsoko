"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/data/categories";

export function CategorySidebar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="hidden lg:flex flex-col border-r-4 border-black bg-white h-full overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#d1d5db_transparent]">
      {CATEGORIES.map((cat, i) => {
        const isOpen = hoveredIndex === i;
        return (
          <div
            key={cat.slug}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link
              href={`/products/category/${cat.slug}`}
              className={`flex items-center gap-3 px-5 py-3 font-bold text-sm border-b border-gray-100 transition-colors duration-150 ${
                isOpen ? "bg-yellow-300 text-black" : "text-gray-700 hover:bg-yellow-300"
              }`}
            >
              <span>{cat.icon}</span>
              <span className="flex-1">{cat.name}</span>
              <ChevronRight
                className={`w-3 h-3 shrink-0 transition-transform duration-300 ease-in-out ${
                  isOpen ? "rotate-90 opacity-80" : "opacity-40"
                }`}
              />
            </Link>

            <div
              className={`overflow-hidden transition-[max-height,opacity] ease-in-out ${
                isOpen
                  ? "max-h-96 opacity-100 duration-300"
                  : "max-h-0 opacity-0 duration-200"
              }`}
            >
              <div className="bg-gray-50 border-b border-gray-200">
                {cat.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/products/category/${cat.slug}/${sub.slug}`}
                    className="flex items-center gap-2.5 pl-10 pr-5 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100 hover:bg-yellow-300 hover:text-black transition-colors duration-150"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
