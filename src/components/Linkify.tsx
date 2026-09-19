import Link from "next/link";
import type { ReactNode } from "react";

const LINK_RE = /\[([^\]]+)\]\((\/[^)\s]+)\)/g;

/**
 * Render `[text](/internal/path)` inside a plain string as <Link>s.
 *
 * Static SEO pages keep their prose in const arrays rendered as text nodes;
 * scripts/seo/internal-links.mjs --apply writes contextual links into those
 * strings in this form and wraps the render site in linkify(). Plain strings
 * pass through untouched, so wrapping a field that has no link is harmless.
 */
export function linkify(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const at = m.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    parts.push(
      <Link key={at} href={m[2]} className="text-[#89e219] underline underline-offset-2 hover:text-white">
        {m[1]}
      </Link>
    );
    last = at + m[0].length;
  }
  if (parts.length === 0) return text;
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
