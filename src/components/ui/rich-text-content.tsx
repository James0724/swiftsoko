"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { sanitizeProductHtml } from "@/lib/sanitize-html";

export function RichTextContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const safeHtml = useMemo(() => sanitizeProductHtml(html), [html]);

  if (!safeHtml) return null;

  return (
    <div
      className={cn(
        "[&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:italic [&_h2]:tracking-tighter [&_h2]:mb-2",
        "[&_h3]:text-xl [&_h3]:font-black [&_h3]:uppercase [&_h3]:mb-2",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:pl-3 [&_blockquote]:italic",
        "[&_a]:underline [&_a]:font-bold",
        "[&_img]:border-2 [&_img]:border-black [&_img]:max-w-full [&_img]:my-2",
        "[&_p]:mb-2",
        className
      )}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
