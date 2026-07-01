"use client";

import { useState, useMemo, useRef } from "react";

export interface BrandOption {
  id: string;
  name: string;
}

interface BrandAutocompleteProps {
  brands: BrandOption[];
  value: string; // brandId
  onChange: (brandId: string) => void;
  error?: string;
}

export function BrandAutocomplete({ brands, value, onChange, error }: BrandAutocompleteProps) {
  const [inputValue, setInputValue] = useState(() => {
    const match = brands.find((b) => b.id === value);
    return match?.name ?? "";
  });
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">(() =>
    value ? "valid" : "idle"
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return brands.slice(0, 8);
    return brands.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 8);
  }, [brands, inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setStatus("idle");
    onChange("");
    setOpen(true);
  };

  const handleSelect = (brand: BrandOption) => {
    setInputValue(brand.name);
    onChange(brand.id);
    setStatus("valid");
    setOpen(false);
  };

  const handleBlur = () => {
    // Small delay to allow mousedown on a suggestion to fire first
    setTimeout(() => {
      setOpen(false);
      const trimmed = inputValue.trim();
      if (!trimmed) {
        setStatus("idle");
        return;
      }
      const exact = brands.find((b) => b.name.toLowerCase() === trimmed.toLowerCase());
      if (exact) {
        setInputValue(exact.name);
        onChange(exact.id);
        setStatus("valid");
      } else {
        onChange("");
        setStatus("invalid");
      }
    }, 150);
  };

  const borderClass =
    status === "valid"
      ? "border-green-500"
      : status === "invalid"
      ? "border-red-500"
      : "border-black";

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onBlur={handleBlur}
          placeholder="Type to search brands..."
          autoComplete="off"
          className={`w-full h-12 px-4 pr-10 border-4 font-bold text-sm focus:outline-none focus:bg-yellow-50 ${borderClass}`}
        />
        {status === "valid" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 font-black text-base select-none">
            ✓
          </span>
        )}
        {status === "invalid" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 font-black text-base select-none">
            ✗
          </span>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-50 w-full bg-white border-4 border-black border-t-0 max-h-52 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {filtered.map((brand) => (
            <button
              key={brand.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(brand);
              }}
              className="w-full text-left px-4 py-2.5 font-bold text-sm hover:bg-yellow-100 border-b border-gray-100 last:border-0 transition-colors"
            >
              {brand.name}
            </button>
          ))}
        </div>
      )}

      {open && inputValue.trim() && filtered.length === 0 && (
        <div className="absolute z-50 w-full bg-white border-4 border-black border-t-0 px-4 py-3 text-sm font-bold text-gray-400 italic">
          No brands match "{inputValue.trim()}"
        </div>
      )}

      {status === "invalid" && (
        <p className="text-red-600 font-bold text-[10px] italic mt-1">
          Brand not found in database — select from the suggestions
        </p>
      )}
      {error && status !== "invalid" && (
        <p className="text-red-600 font-bold text-[10px] italic mt-1">{error}</p>
      )}
    </div>
  );
}
