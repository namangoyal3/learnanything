// Paths the SEO prune noindexed (scripts/seo/prune-manifest.json → --prune →
// src/data/pruned-urls.json). Pages stay live; middleware adds X-Robots-Tag
// and the sitemap omits them. Policy: docs/seo-autonomy.md.
import pruned from "@/data/pruned-urls.json";

const NOINDEX = new Set<string>(pruned.noindex);

const normalize = (path: string) => path.replace(/\/+$/, "") || "/";

export const isNoindexed = (path: string): boolean => NOINDEX.has(normalize(path));

export const noindexedPaths: readonly string[] = pruned.noindex;
export const prunedAt: string = pruned.generatedAt;
