/**
 * scripts/seo/datasets.mjs — first-party data gate (v2 spec §1c).
 *
 * Every new page must embed a data block sourced from a dataset that actually
 * lives in this repo, marked up in the article body as:
 *
 *   <!-- first-party-data: <dataset-id> -->
 *   ...markdown table / list with the data...
 *   <!-- /first-party-data -->
 *
 * The gate checks three things:
 *   1. the id is registered below (i.e. the data source really exists here),
 *   2. the block has ≥3 data rows (a real table, not a one-liner),
 *   3. ≥2 values from the dataset snapshot appear verbatim in the block —
 *      an anti-hallucination spot-check so the block can't just *claim* to
 *      use our data.
 *
 * Registered datasets are extracted from repo sources at load time, so the
 * snapshot tracks the repo instead of rotting in a copy.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT, FILES } from "./config.mjs";

export function loadDatasets() {
  const out = {};

  // 1. Quiz/lesson question bank (prisma/seed.ts)
  try {
    const seed = readFileSync(join(ROOT, "prisma", "seed.ts"), "utf8");
    const questions = [...seed.matchAll(/questionText:\s*["'`](.{10,80}?)["'`]/g)].map((m) => m[1]);
    const lessonTitles = [...seed.matchAll(/title:\s*["'`](.{4,80}?)["'`]/g)].map((m) => m[1]);
    out["pm-quiz-bank"] = {
      label: "PM Streak quiz question bank (prisma/seed.ts)",
      values: [...(questions.length ? [String(questions.length)] : []), ...questions.slice(0, 30), ...lessonTitles.slice(0, 20)],
    };
  } catch {
    /* dataset unavailable in this checkout */
  }

  // 2. India PM salary table (static salary page)
  try {
    const page = readFileSync(join(ROOT, "src", "app", "product-manager-salary-india", "page.tsx"), "utf8");
    const ranges = [...page.matchAll(/₹\d+[–-]\d+L/g)].map((m) => m[0]);
    if (ranges.length) {
      out["india-pm-salary-2026"] = {
        label: "India PM salary bands (src/app/product-manager-salary-india)",
        values: [...new Set(ranges)],
      };
    }
  } catch {
    /* dataset unavailable */
  }

  // 3. Lesson catalog size (live sitemap crawl cache — /learn/pm/* count)
  try {
    if (existsSync(FILES.GRAPH_CACHE)) {
      const cache = JSON.parse(readFileSync(FILES.GRAPH_CACHE, "utf8"));
      const learn = Object.keys(cache.pages || {}).filter((p) => p.startsWith("/learn/")).length;
      if (learn > 0) {
        out["lesson-catalog"] = {
          label: "Published lesson catalog size (live sitemap)",
          values: [String(learn)],
        };
      }
    }
  } catch {
    /* dataset unavailable */
  }

  return out;
}

const BLOCK_RE = /<!--\s*first-party-data:\s*([a-z0-9-]+)\s*-->([\s\S]*?)<!--\s*\/first-party-data\s*-->/i;

export function validateFirstPartyBlock(body, datasets = loadDatasets()) {
  const m = body.match(BLOCK_RE);
  if (!m) {
    return {
      pass: false,
      reason: "no <!-- first-party-data: <id> --> … <!-- /first-party-data --> block in body",
    };
  }
  const [, id, block] = m;
  const ds = datasets[id];
  if (!ds) {
    return { pass: false, datasetId: id, reason: `dataset "${id}" not registered (known: ${Object.keys(datasets).join(", ") || "none"})` };
  }
  const rows = block
    .split("\n")
    .filter((l) => /\d/.test(l) && (/\|.+\|/.test(l) || /^\s*([-*•]|\d+\.)\s+/.test(l)));
  if (rows.length < 3) {
    return { pass: false, datasetId: id, reason: `data block has ${rows.length} data rows, need ≥3` };
  }
  const needed = ds.values.length < 4 ? 1 : 2;
  const hits = ds.values.filter((v) => block.includes(v));
  if (hits.length < needed) {
    return {
      pass: false,
      datasetId: id,
      reason: `spot-check failed: ${hits.length}/${needed} dataset values found in block (block must quote real values from ${ds.label})`,
    };
  }
  return { pass: true, datasetId: id, reason: `ok — ${rows.length} rows, ${hits.length} dataset values matched` };
}
