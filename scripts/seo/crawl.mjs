/**
 * scripts/seo/crawl.mjs — site link-graph builder.
 *
 * Feeds two v2 gates:
 *   §1a inlink/orphan gate — who links to whom, click depth from home.
 *   §1b dedupe gate        — extracted page text for embeddings.
 *
 * Read-only GETs against our own prod site, concurrency-limited, cached on
 * disk for 7 days (scripts/seo/site-graph-cache.json, gitignored).
 *
 * Deliberate choice: <header>/<footer>/<nav> are stripped BEFORE link
 * extraction, so inlink counts reflect *contextual* (body) links only —
 * sitewide chrome links don't let a page fake its way past the ≥3-inlinks
 * gate, and hub listing pages still count because their lists are body
 * content.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { FILES, SITE, HOST } from "./config.mjs";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

export async function getSitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`sitemap.xml ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

export function toPath(url) {
  try {
    const u = new URL(url, SITE);
    let p = u.pathname.replace(/\/+$/, "");
    return p === "" ? "/" : p;
  } catch {
    return null;
  }
}

function normalizeInternal(href, basePath) {
  if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) return null;
  try {
    const u = new URL(href, `${SITE}${basePath}`);
    if (u.hostname !== HOST && u.hostname !== `www.${HOST}`) return null;
    let p = u.pathname.replace(/\/+$/, "");
    return p === "" ? "/" : p;
  } catch {
    return null;
  }
}

const CHROME_RE = /<(header|footer|nav)[\s\S]*?<\/\1>/gi;
const NOISE_RE = /<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi;

export function extractBody(html) {
  return html.replace(NOISE_RE, " ").replace(CHROME_RE, " ");
}

export function extractLinks(bodyHtml, basePath) {
  const out = new Set();
  for (const m of bodyHtml.matchAll(/<a\s[^>]*href="([^"]+)"/gi)) {
    const p = normalizeInternal(m[1].replace(/&amp;/g, "&"), basePath);
    if (p && p !== basePath) out.add(p);
  }
  return [...out];
}

export function extractText(bodyHtml) {
  return bodyHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);
}

function loadGraphCache() {
  if (!existsSync(FILES.GRAPH_CACHE)) return { pages: {} };
  try {
    return JSON.parse(readFileSync(FILES.GRAPH_CACHE, "utf8"));
  } catch {
    return { pages: {} };
  }
}

/**
 * buildSiteGraph — fetch (or reuse cached) page data for the given URLs.
 * Returns { pages: { "/path": { status, links[], text, fetchedAt } } }.
 */
export async function buildSiteGraph(urls, { concurrency = 10, maxAgeHours = 168, limit = null, quiet = false } = {}) {
  const cache = loadGraphCache();
  const cutoff = Date.now() - maxAgeHours * 3600e3;
  let paths = urls.map(toPath).filter(Boolean);
  if (limit) paths = paths.slice(0, limit);
  const stale = paths.filter((p) => {
    const e = cache.pages[p];
    return !e || new Date(e.fetchedAt).getTime() < cutoff;
  });
  if (!quiet) console.log(`crawl: ${paths.length} pages, ${stale.length} to fetch (rest cached)`);

  let done = 0;
  const worker = async () => {
    while (stale.length) {
      const p = stale.shift();
      try {
        let res;
        for (let attempt = 1; ; attempt++) {
          const ctl = new AbortController();
          const t = setTimeout(() => ctl.abort(), 60000);
          try {
            res = await fetch(`${SITE}${p}`, { headers: { "User-Agent": UA }, signal: ctl.signal, redirect: "follow" });
            break;
          } catch (e) {
            if (attempt >= 2) throw e;
            await new Promise((r) => setTimeout(r, 3000));
          } finally {
            clearTimeout(t);
          }
        }
        const html = res.ok ? await res.text() : "";
        const body = res.ok ? extractBody(html) : "";
        cache.pages[p] = {
          status: res.status,
          links: res.ok ? extractLinks(body, p) : [],
          text: res.ok ? extractText(body) : "",
          fetchedAt: new Date().toISOString(),
        };
      } catch (e) {
        cache.pages[p] = { status: 0, links: [], text: "", error: e.message?.slice(0, 80), fetchedAt: new Date().toISOString() };
      }
      done++;
      if (done % 100 === 0) {
        writeFileSync(FILES.GRAPH_CACHE, JSON.stringify(cache));
        if (!quiet) console.log(`crawl: ${done} fetched…`);
      }
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
  writeFileSync(FILES.GRAPH_CACHE, JSON.stringify(cache));
  return { pages: Object.fromEntries(paths.map((p) => [p, cache.pages[p]]).filter(([, v]) => v)) };
}

/**
 * graphStats — inlink counts (distinct source pages), BFS click depth from
 * home, and orphan list, computed over the crawled set.
 */
export function graphStats(graph) {
  const paths = Object.keys(graph.pages);
  const inSet = new Set(paths);
  const inlinks = Object.fromEntries(paths.map((p) => [p, new Set()]));
  for (const [src, page] of Object.entries(graph.pages)) {
    for (const dst of page.links || []) {
      if (inSet.has(dst) && dst !== src) inlinks[dst].add(src);
    }
  }
  // BFS depth from "/"
  const depths = { "/": 0 };
  let frontier = ["/"];
  while (frontier.length) {
    const next = [];
    for (const p of frontier) {
      for (const dst of graph.pages[p]?.links || []) {
        if (inSet.has(dst) && !(dst in depths)) {
          depths[dst] = depths[p] + 1;
          next.push(dst);
        }
      }
    }
    frontier = next;
  }
  const inlinkCounts = Object.fromEntries(paths.map((p) => [p, inlinks[p].size]));
  const orphans = paths.filter((p) => p !== "/" && inlinkCounts[p] === 0);
  return { inlinkCounts, inlinkSources: inlinks, depths, orphans };
}
