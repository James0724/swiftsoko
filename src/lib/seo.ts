import sanitizeHtml from "sanitize-html";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://swiftsoko.co.ke"
).replace(/\/$/, "");

export const SITE_NAME = "Swiftsoko";

export const DEFAULT_DESCRIPTION =
  "Shop electronics, fashion, home & living, health & beauty and more on Swiftsoko — Nairobi's fast online marketplace. Genuine products, fast delivery across Kenya.";

export const DEFAULT_KEYWORDS = [
  "online shopping Kenya",
  "buy online Nairobi",
  "Swiftsoko",
  "ecommerce Kenya",
  "electronics Kenya",
  "fashion Kenya",
];

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Strips HTML and collapses whitespace, for building plain-text meta descriptions from rich-text fields. */
export function stripHtml(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}
