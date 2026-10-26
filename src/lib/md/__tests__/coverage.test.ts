import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ARTICLE_ROUTE, MARKDOWN_SKIP, PRIVATE_ROUTES, STATIC_MARKDOWN_ROUTES } from "@/lib/md/routes";
import { PUBLIC_ROUTES } from "@/lib/seo/public-routes";
import { buildPageMeta } from "../../../../scripts/generate-seo-page-meta.mjs";
import pageMeta from "../../../../scripts/seo-page-meta.json";

const APP_DIR = path.resolve(__dirname, "../../../app");

function appRoutes(dir: string, route = ""): string[] {
  const routes = existsSync(path.join(dir, "page.tsx")) ? [route || "/"] : [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== "api") routes.push(...appRoutes(path.join(dir, entry.name), `${route}/${entry.name}`));
  }
  return routes;
}

describe("markdown twin coverage", () => {
  it("every page has a markdown renderer, or is skipped with a reason", () => {
    const uncovered = appRoutes(APP_DIR).filter(
      (route) =>
        !STATIC_MARKDOWN_ROUTES.has(route) &&
        !ARTICLE_ROUTE.test(route) &&
        !(route in MARKDOWN_SKIP) &&
        !(route in PRIVATE_ROUTES),
    );
    // Fix: add the route to PUBLIC_ROUTES (src/lib/seo/public-routes.ts) if it is public
    // content, or to MARKDOWN_SKIP / PRIVATE_ROUTES (src/lib/md/routes.ts) with a reason.
    expect(uncovered).toEqual([]);
  });

  it("every public route points at a real page", () => {
    const pages = new Set(appRoutes(APP_DIR));
    expect(PUBLIC_ROUTES.map((r) => r.path).filter((p) => !pages.has(p))).toEqual([]);
  });

  it("no private route is public", () => {
    expect(PUBLIC_ROUTES.map((r) => r.path).filter((p) => p in PRIVATE_ROUTES)).toEqual([]);
  });

  it("scripts/seo-page-meta.json is up to date (run node scripts/generate-seo-page-meta.mjs)", () => {
    expect(buildPageMeta()).toEqual(pageMeta);
  });
});
