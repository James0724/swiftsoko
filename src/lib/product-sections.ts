export const PRODUCT_SECTIONS = [
  { value: "FEATURED", label: "Featured Products" },
  { value: "FLASH_DEALS", label: "Flash Deals / On Sale" },
  { value: "TOP_RATED", label: "Top Rated" },
] as const;

export type ProductSection = (typeof PRODUCT_SECTIONS)[number]["value"];

const VALID_SECTIONS = new Set<string>(PRODUCT_SECTIONS.map((s) => s.value));

export function sanitizeSections(sections: unknown): string[] {
  if (!Array.isArray(sections)) return [];
  return sections.filter(
    (s): s is string => typeof s === "string" && VALID_SECTIONS.has(s)
  );
}
