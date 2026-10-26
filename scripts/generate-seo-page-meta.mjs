#!/usr/bin/env node
/**
 * scripts/generate-seo-page-meta.mjs — title/description manifest for static pages.
 *
 * Reads the `export const metadata` object of every static src/app/<route>/page.tsx
 * and writes scripts/seo-page-meta.json as { "/<route>": { title, description } }.
 * /llms.txt and the markdown catalog use it to describe each page without
 * importing (and bundling) hundreds of page modules.
 *
 * Only top-level string-literal `title` / `description` keys are read; pages
 * whose metadata is computed or missing are left out and fall back to their slug.
 * src/lib/md/__tests__/coverage.test.ts fails when this file is stale.
 *
 * Usage: node scripts/generate-seo-page-meta.mjs   (commit the JSON)
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP_DIR = join(ROOT, "src", "app");
const OUT_FILE = join(ROOT, "scripts", "seo-page-meta.json");

const STRING = String.raw`"(?:[^"\\]|\\.)*"`;

function readString(block, key) {
  // Top-level keys of the metadata object sit at exactly two spaces of indent.
  const plain = new RegExp(String.raw`^  ${key}:\s*(${STRING})`, "m").exec(block);
  const absolute = new RegExp(String.raw`^  ${key}:\s*\{\s*absolute:\s*(${STRING})`, "m").exec(block);
  const hit = plain ?? absolute;
  return hit ? JSON.parse(hit[1]) : undefined;
}

function pageFiles(dir, route = "") {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "api" || entry.name.startsWith("[")) continue;
    out.push(...pageFiles(join(dir, entry.name), `${route}/${entry.name}`));
  }
  const page = join(dir, "page.tsx");
  if (existsSync(page)) out.push([route || "/", page]);
  return out;
}

export function buildPageMeta() {
  const meta = {};
  for (const [route, file] of pageFiles(APP_DIR).sort(([a], [b]) => a.localeCompare(b))) {
    const src = readFileSync(file, "utf8");
    const start = src.indexOf("export const metadata");
    if (start === -1) continue;
    const block = src.slice(start, src.indexOf("\n};", start));
    const title = readString(block, "title");
    const description = readString(block, "description");
    if (title && description) meta[route] = { title, description };
  }
  return meta;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const meta = buildPageMeta();
  writeFileSync(OUT_FILE, `${JSON.stringify(meta, null, 2)}\n`);
  console.log(`wrote ${Object.keys(meta).length} routes to ${OUT_FILE}`);
}
