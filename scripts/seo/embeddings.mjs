/**
 * scripts/seo/embeddings.mjs — text embeddings for the one-intent-per-page
 * dedupe gate (v2 spec §1b: reject candidate if cosine ≥ 0.85 vs any existing page).
 *
 * Provider order (recorded in every result so reviewers know which semantics
 * the threshold was applied under):
 *   1. "ollama:<model>" — a local Ollama embedding model at 127.0.0.1:11434,
 *      but ONLY if one is already pulled. We never pull models from here.
 *   2. "hash-tfidf-v1" — fallback: hashed word + char-3-gram TF vector
 *      (1024-dim, L2-normalized). Purely lexical: reliably catches the
 *      templated near-duplicates programmatic SEO produces, but NOT
 *      paraphrase-level semantic overlap. Documented limitation in
 *      implementation-notes.md.
 *
 * Stdlib-only + optional localhost HTTP. No cloud calls, no new deps.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { FILES } from "./config.mjs";

const OLLAMA = process.env.SEO_EMBED_OLLAMA_URL || "http://127.0.0.1:11434";
const EMB_MODEL_RE = /embed|minilm|bge|arctic/i;
const DIMS = 1024;

let providerPromise = null;

async function detectProvider() {
  if (process.env.SEO_EMBED_FORCE_HASH === "1") return { type: "hash", id: "hash-tfidf-v1" };
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 1500);
    const res = await fetch(`${OLLAMA}/api/tags`, { signal: ctl.signal });
    clearTimeout(t);
    if (res.ok) {
      const data = await res.json();
      const model =
        process.env.SEO_EMBED_MODEL ||
        (data.models || []).map((m) => m.name).find((n) => EMB_MODEL_RE.test(n));
      if (model) return { type: "ollama", model, id: `ollama:${model}` };
    }
  } catch {
    /* Ollama not running — fall through */
  }
  return { type: "hash", id: "hash-tfidf-v1" };
}

export function embedProvider() {
  if (!providerPromise) providerPromise = detectProvider();
  return providerPromise;
}

// ── hashed TF fallback ───────────────────────────────────────────────────────
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function hashEmbed(text) {
  const vec = new Float64Array(DIMS);
  const clean = text.toLowerCase().replace(/[^a-z0-9₹%$ ]+/g, " ").replace(/\s+/g, " ").slice(0, 8000);
  for (const w of clean.split(" ")) {
    if (w.length < 2) continue;
    vec[fnv1a(`w:${w}`) % DIMS] += 2; // word unigrams, weighted up
  }
  const joined = clean.replace(/ /g, "_");
  for (let i = 0; i + 3 <= joined.length; i++) {
    vec[fnv1a(`t:${joined.slice(i, i + 3)}`) % DIMS] += 1; // char 3-grams
  }
  let norm = 0;
  for (let i = 0; i < DIMS; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm) || 1;
  return Array.from(vec, (x) => +(x / norm).toFixed(6));
}

export function cosine(a, b) {
  let dot = 0,
    na = 0,
    nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const d = Math.sqrt(na) * Math.sqrt(nb);
  return d === 0 ? 0 : dot / d;
}

// ── provider-aware batch embed with disk cache ───────────────────────────────
function loadCache(providerId) {
  if (!existsSync(FILES.EMB_CACHE)) return { provider: providerId, entries: {} };
  try {
    const c = JSON.parse(readFileSync(FILES.EMB_CACHE, "utf8"));
    // Cache is only valid for the provider that produced it.
    return c.provider === providerId ? c : { provider: providerId, entries: {} };
  } catch {
    return { provider: providerId, entries: {} };
  }
}

const keyOf = (text) => createHash("sha256").update(text.slice(0, 8000)).digest("hex").slice(0, 24);

async function ollamaEmbed(model, texts) {
  const res = await fetch(`${OLLAMA}/api/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, input: texts.map((t) => t.slice(0, 8000)) }),
  });
  if (!res.ok) throw new Error(`ollama /api/embed ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data.embeddings)) throw new Error("ollama: no embeddings in response");
  return data.embeddings;
}

/**
 * embedTexts(texts) → { providerId, vectors } — cached on disk, batch-embeds
 * only cache misses. Falls back to hashEmbed if the Ollama call fails mid-run.
 */
export async function embedTexts(texts, { cache = true } = {}) {
  const provider = await embedProvider();
  const store = cache ? loadCache(provider.id) : { provider: provider.id, entries: {} };
  const vectors = new Array(texts.length);
  const missIdx = [];
  texts.forEach((t, i) => {
    const hit = store.entries[keyOf(t)];
    if (hit) vectors[i] = hit;
    else missIdx.push(i);
  });

  if (missIdx.length) {
    let fresh;
    if (provider.type === "ollama") {
      try {
        // Ollama handles batches; chunk to keep request bodies sane.
        fresh = [];
        for (let i = 0; i < missIdx.length; i += 32) {
          const chunk = missIdx.slice(i, i + 32).map((j) => texts[j]);
          fresh.push(...(await ollamaEmbed(provider.model, chunk)));
        }
      } catch (e) {
        console.error(`embeddings: ollama failed (${e.message}) — falling back to hash-tfidf-v1`);
        providerPromise = Promise.resolve({ type: "hash", id: "hash-tfidf-v1" });
        return embedTexts(texts, { cache });
      }
    } else {
      fresh = missIdx.map((j) => hashEmbed(texts[j]));
    }
    missIdx.forEach((j, k) => {
      vectors[j] = fresh[k];
      store.entries[keyOf(texts[j])] = fresh[k];
    });
    if (cache) writeFileSync(FILES.EMB_CACHE, JSON.stringify(store));
  }
  return { providerId: provider.id, vectors };
}
