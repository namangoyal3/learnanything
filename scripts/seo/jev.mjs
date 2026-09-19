/**
 * scripts/seo/jev.mjs — TypeSafe System One (Jev) client for the SEO pipeline.
 *
 * Jev returns typed judgments (probabilities), not text. The pipeline keeps
 * every rule, threshold and edit in code and asks Jev only where semantic
 * understanding is needed (topic grouping, relevance, sentence/anchor choice).
 * Docs: https://docs.typesafe.ai/api
 *
 * Raw fetch on purpose — scripts/seo/*.mjs is stdlib-only (see gsc-metrics.mjs)
 * and CLAUDE.md forbids new deps when existing ones suffice. Every answer is
 * cached on disk keyed by sha1(state+questions), so re-runs and review loops
 * cost nothing (same idea as embeddings-cache.json).
 *
 * Env: TYPESAFE_API_KEY (server-side only, never logged).
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { FILES } from "./config.mjs";

const ENDPOINT = "https://api.typesafe.ai/v1/systemone";
const MODEL = "jev-latest";
const RETRY_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

/** Question constructors — mirror the three System One primitives. */
export const noul = (instructions, criteria) => ({ type: "noul", instructions, ...(criteria ? { criteria } : {}) });
export const choice = (instructions, criteria) => ({ type: "choice", instructions, criteria });
export const score = (instructions, criteria) => ({ type: "score", instructions, criteria });

export const usage = { requests: 0, cached: 0, input_tokens: 0, output_tokens: 0 };

let cache = null;
let dirty = 0;

function loadCache() {
  if (cache) return cache;
  cache = {};
  if (existsSync(FILES.JEV_CACHE)) {
    try {
      cache = JSON.parse(readFileSync(FILES.JEV_CACHE, "utf8"));
    } catch {
      cache = {};
    }
  }
  return cache;
}

export function flushJevCache() {
  if (cache && dirty) {
    writeFileSync(FILES.JEV_CACHE, JSON.stringify(cache));
    dirty = 0;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * systemOne — evaluate `questions` (map id → question) against `state`.
 * Returns the `answers` map. Throws on auth/validation errors; retries with
 * backoff on rate limits and 5xx so one flaky call doesn't abort a run.
 */
export async function systemOne(state, questions, { retries = 5 } = {}) {
  const c = loadCache();
  const key = createHash("sha1").update(JSON.stringify({ MODEL, state, questions })).digest("hex");
  if (c[key]) {
    usage.cached++;
    return c[key];
  }
  const apiKey = process.env.TYPESAFE_API_KEY;
  if (!apiKey) throw new Error("TYPESAFE_API_KEY not set");

  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ state, model: MODEL, questions }),
      });
    } catch (e) {
      if (attempt >= retries) throw e;
      await sleep(1000 * 2 ** attempt);
      continue;
    }
    if (res.ok) {
      const data = await res.json();
      usage.requests++;
      usage.input_tokens += data.usage?.input_tokens ?? 0;
      usage.output_tokens += data.usage?.output_tokens ?? 0;
      c[key] = data.answers;
      if (++dirty % 25 === 0) flushJevCache();
      return data.answers;
    }
    if (RETRY_STATUSES.has(res.status) && attempt < retries) {
      const retryAfter = Number(res.headers.get("retry-after")) || 0;
      await sleep(Math.max(retryAfter * 1000, 1000 * 2 ** attempt));
      continue;
    }
    throw new Error(`jev ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

/** Bounded-concurrency map — keeps request volume polite without a dep. */
export async function pMap(items, fn, concurrency = 4) {
  const out = new Array(items.length);
  let i = 0;
  const worker = async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return out;
}
