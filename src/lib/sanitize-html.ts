import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "h2", "h3", "h4", "p", "strong", "em", "u", "s", "a",
  "ul", "ol", "li", "br", "blockquote", "code", "pre", "img",
];
const ALLOWED_ATTR = ["href", "src", "alt", "title"];

export function sanitizeProductHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { "*": ALLOWED_ATTR },
  });
}

export const SHORT_DESCRIPTION_MAX_WORDS = 600;

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}
