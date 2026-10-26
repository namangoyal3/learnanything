import { NextResponse } from "next/server";

/**
 * HTTP side of the markdown twins: Accept negotiation and the response headers
 * every markdown answer carries. Edge-safe (middleware imports prefersMarkdown).
 */

/** q-value the Accept header gives `type`, from the most specific matching range (RFC 9110 §12.5.1). */
export function acceptQ(accept: string, type: string): number {
  const [want, wantSub] = type.split("/");
  let best = 0;
  let bestRank = -1;
  for (const part of accept.toLowerCase().split(",")) {
    const [range, ...params] = part.split(";").map((s) => s.trim());
    const [t, sub] = range.split("/");
    const rank = t === want && sub === wantSub ? 2 : t === want && sub === "*" ? 1 : t === "*" && sub === "*" ? 0 : -1;
    if (rank <= bestRank) continue;
    const qParam = params.find((p) => p.startsWith("q="));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    bestRank = rank;
    best = Number.isFinite(q) ? q : 0;
  }
  return best;
}

/** Markdown only when the client ranks it above HTML. `*\/*` and no header stay HTML. */
export function prefersMarkdown(accept: string | null): boolean {
  return Boolean(accept) && acceptQ(accept!, "text/markdown") > acceptQ(accept!, "text/html");
}

export const MD_CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type, If-Modified-Since",
  "Access-Control-Expose-Headers": "X-Markdown-Tokens, Last-Modified, Link, Content-Location",
};

type MarkdownResponseOptions = {
  status?: number;
  canonical?: string;
  lastModified?: Date;
  /** CDN cache lifetime; static pages pass a longer one. */
  sMaxAge?: number;
  head?: boolean;
};

export function markdownResponse(body: string, opts: MarkdownResponseOptions = {}): NextResponse {
  const { status = 200, canonical, lastModified, sMaxAge = 3600, head = false } = opts;
  const headers: Record<string, string> = {
    ...MD_CORS,
    "Content-Type": "text/markdown; charset=utf-8",
    "X-Markdown-Tokens": String(Math.ceil(body.length / 4)),
    "X-Robots-Tag": "noindex, follow",
    "X-Content-Type-Options": "nosniff",
    Vary: "Accept",
    "Cache-Control":
      status === 200
        ? `public, s-maxage=${sMaxAge}, stale-while-revalidate=${Math.max(86400, sMaxAge * 7)}`
        : "public, s-maxage=300",
  };
  if (canonical) {
    headers["Content-Location"] = canonical;
    headers.Link = `<${canonical}>; rel="canonical"`;
  }
  if (lastModified) headers["Last-Modified"] = lastModified.toUTCString();
  return new NextResponse(head ? null : body, { status, headers });
}
