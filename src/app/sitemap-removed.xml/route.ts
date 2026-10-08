// Temporary removals sitemap: lists the noindexed URLs so Googlebot recrawls
// them and processes the noindex faster. Submit it in Search Console; delete
// this route ~4-6 weeks after the prune deploys (seo-drafts/prune-runbook.md).
import { noindexedPaths, prunedAt } from "@/lib/pruned";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://learnanything.pro";

export function GET() {
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...noindexedPaths.map((p) => `  <url><loc>${escape(siteUrl + p)}</loc><lastmod>${prunedAt.slice(0, 10)}</lastmod></url>`),
    "</urlset>",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
