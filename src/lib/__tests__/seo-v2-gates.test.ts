/**
 * SEO pipeline v2 — gate decision logic (pure functions only, no network).
 * Modules under test live in scripts/seo/*.mjs; vitest imports them as ESM.
 */
import { describe, it, expect } from "vitest";
// @ts-ignore — plain .mjs modules without type declarations
import { checkThroughput, checkInlinkPlan, circuitBreakerState, checkProbeBatch } from "../../../scripts/seo/gates.mjs";
// @ts-ignore
import { computeClusterVerdict } from "../../../scripts/seo/clusters.mjs";
// @ts-ignore
import { hashEmbed, cosine } from "../../../scripts/seo/embeddings.mjs";
// @ts-ignore
import { validateFirstPartyBlock } from "../../../scripts/seo/datasets.mjs";

const DAY = 864e5;

describe("throughput cap (§2)", () => {
  const now = Date.parse("2026-04-20T00:00:00Z");
  it("allows publish under the cap", () => {
    const r = checkThroughput([new Date(now - 2 * DAY).toISOString()], now);
    expect(r.pass).toBe(true);
  });
  it("blocks at 3 publishes in trailing 7d", () => {
    const ts = [1, 2, 3].map((d) => new Date(now - d * DAY).toISOString());
    expect(checkThroughput(ts, now).pass).toBe(false);
  });
  it("ignores publishes older than 7d", () => {
    const ts = [8, 9, 10].map((d) => new Date(now - d * DAY).toISOString());
    expect(checkThroughput(ts, now).pass).toBe(true);
  });
});

describe("circuit breaker (§3)", () => {
  it("halts below 30%", () => expect(circuitBreakerState(8.5).halted).toBe(true));
  it("open at/above 30%", () => expect(circuitBreakerState(30).halted).toBe(false));
  it("fails closed when indexed% unknown", () => expect(circuitBreakerState(null).halted).toBe(true));
});

describe("inlink plan (§1a)", () => {
  const sitemapPaths = new Set(["/a", "/b", "/c", "/deep"]);
  it("requires 3 valid distinct sources", () => {
    expect(checkInlinkPlan(["/a", "/b"], { sitemapPaths }).pass).toBe(false);
    expect(checkInlinkPlan(["/a", "/a", "/b"], { sitemapPaths }).pass).toBe(false); // dupes collapse
    expect(checkInlinkPlan(["/a", "/b", "/c"], { sitemapPaths }).pass).toBe(true);
  });
  it("rejects sources not in the sitemap", () => {
    expect(checkInlinkPlan(["/a", "/b", "/nope"], { sitemapPaths }).pass).toBe(false);
  });
  it("enforces ≤3 clicks from home when depths known", () => {
    const deep = { "/a": 9, "/b": 9, "/c": 9 };
    expect(checkInlinkPlan(["/a", "/b", "/c"], { sitemapPaths, depths: deep }).pass).toBe(false);
    const ok = { "/a": 1, "/b": 9, "/c": 9 };
    expect(checkInlinkPlan(["/a", "/b", "/c"], { sitemapPaths, depths: ok }).pass).toBe(true);
  });
});

describe("probe batch (§2)", () => {
  it("blocks frozen/killed clusters and full batches", () => {
    expect(checkProbeBatch({ id: "x", status: "frozen" }).pass).toBe(false);
    expect(checkProbeBatch({ id: "x", status: "killed" }).pass).toBe(false);
    expect(checkProbeBatch({ id: "x", status: "probe", probeBatch: { published: 10 } }).pass).toBe(false);
    expect(checkProbeBatch({ id: "x", status: "probe", probeBatch: { published: 4 } }).pass).toBe(true);
    expect(checkProbeBatch(null).pass).toBe(false); // no cluster assigned
  });
});

describe("cluster verdicts 30/60/90 (§3)", () => {
  it("never kills before 90d", () => {
    expect(computeClusterVerdict({ ageDays: 20, impressions30d: 0 }).verdict).toBe("watch");
    expect(computeClusterVerdict({ ageDays: 45, impressions30d: 0 }).verdict).toBe("watch");
    expect(computeClusterVerdict({ ageDays: 70, impressions30d: 0 }).verdict).toBe("freeze");
  });
  it("60d: rising impressions continue", () => {
    const v = computeClusterVerdict({ ageDays: 70, impressions30d: 40, impressionsPrev30d: 10 });
    expect(v.verdict).toBe("continue");
  });
  it("90d: dead cluster is killed", () => {
    expect(computeClusterVerdict({ ageDays: 120, impressions30d: 0, impressionsPrev30d: 0 }).verdict).toBe("kill");
  });
  it("90d: rising-but-low is spared (impressions lead rankings)", () => {
    const v = computeClusterVerdict({ ageDays: 120, impressions30d: 5, impressionsPrev30d: 1 });
    expect(v.verdict).toBe("watch");
  });
  it("90d: top-30 query keeps a cluster alive", () => {
    const v = computeClusterVerdict({ ageDays: 120, impressions30d: 2, hasTop30Query: true });
    expect(v.verdict).toBe("continue");
  });
  it("age unknown ⇒ judged as mature (pre-v2 inventory)", () => {
    expect(computeClusterVerdict({ ageDays: null, impressions30d: 0 }).stage).toBe("90d");
  });
});

describe("hash embeddings + cosine (§1b fallback)", () => {
  it("identical text ⇒ cosine ≈ 1", () => {
    const a = hashEmbed("product manager interview questions and answers for 2026");
    expect(cosine(a, a)).toBeCloseTo(1, 5);
  });
  it("near-duplicate templated text scores above 0.85, unrelated below", () => {
    const t1 = "The complete guide to product roadmaps in 2026. A roadmap aligns teams around outcomes. Build, prioritize and present a roadmap that works.";
    const t2 = "The complete guide to product roadmaps in 2026. A roadmap aligns teams around outcomes. Build, prioritise and present a roadmap that wins.";
    const t3 = "Salary bands for engineers in Berlin depend on seniority, equity split and company stage across fintech and biotech industries.";
    expect(cosine(hashEmbed(t1), hashEmbed(t2))).toBeGreaterThan(0.85);
    expect(cosine(hashEmbed(t1), hashEmbed(t3))).toBeLessThan(0.85);
  });
  it("is deterministic", () => {
    expect(hashEmbed("same input")).toEqual(hashEmbed("same input"));
  });
});

describe("first-party data block (§1c)", () => {
  const datasets = {
    "india-pm-salary-2026": { label: "salary bands", values: ["₹18–30L", "₹16–26L", "₹15–24L", "₹28–55L"] },
  };
  const good = `intro
<!-- first-party-data: india-pm-salary-2026 -->
| level | band |
| APM | ₹18–30L |
| PM | ₹16–26L |
| SPM | ₹28–55L |
<!-- /first-party-data -->
outro`;
  it("passes a real block", () => {
    expect(validateFirstPartyBlock(good, datasets).pass).toBe(true);
  });
  it("fails when block is missing", () => {
    expect(validateFirstPartyBlock("no data here", datasets).pass).toBe(false);
  });
  it("fails unregistered dataset ids", () => {
    const b = good.replace("india-pm-salary-2026", "made-up-data");
    expect(validateFirstPartyBlock(b, datasets).pass).toBe(false);
  });
  it("fails the anti-hallucination spot-check when values don't match", () => {
    const b = good.replace(/₹\d+–\d+L/g, "₹99–99L");
    expect(validateFirstPartyBlock(b, datasets).pass).toBe(false);
  });
});

// §5 value pass: Jev supplies value/thin per page and same-intent per pair; code owns the cut.
import { buildPruneManifest } from "../../../scripts/seo/prune.mjs";

describe("buildPruneManifest value pass", () => {
  const site = "https://learnanything.pro";
  const text = (s: string) => `${s} `.repeat(60); // ≥200 chars so the page is judged
  const paths = ["/salary", "/learn/pm/deep", "/learn/pm/deep-copy", "/learn/pm/shallow", "/hand-built-shallow", "/jobs"];
  const graph = {
    pages: Object.fromEntries(paths.map((p) => [p, { title: p, text: text(p.includes("deep") ? "worked answers" : p), links: [] }])),
  };
  const values: Record<string, { value: number; thin: number }> = {
    "/learn/pm/deep": { value: 3.1, thin: 0.1 },
    "/learn/pm/deep-copy": { value: 2.9, thin: 0.1 },
    "/learn/pm/shallow": { value: 1.2, thin: 0.8 },
    "/hand-built-shallow": { value: 1.4, thin: 0.6 },
  };
  const valueJudge = async (pages: { path: string }[]) => pages.map((p) => values[p.path]);
  const judge = async (pairs: unknown[]) => pairs.map(() => 0.95); // every cosine suspect is the same question

  it("cuts generated pages below usable, keeps hand-built pages for rewrite, noindexes duplicates", async () => {
    const m = await buildPruneManifest({
      sitemapUrls: paths.map((p) => site + p),
      pages90d: [{ path: "/salary", impressions: 40, clicks: 0, position: 30 }],
      pages16mo: [],
      graph,
      clusters: { clusters: [] },
      judge,
      valueJudge,
      write: false,
    });
    const keep = m.keep.map((k: { path: string }) => k.path);
    const reason = (p: string) => m.noindex.find((k: { path: string }) => k.path === p)?.reasons?.[0] ?? "";
    expect(keep).toEqual(expect.arrayContaining(["/salary", "/jobs", "/learn/pm/deep", "/hand-built-shallow"]));
    expect(keep).not.toContain("/learn/pm/deep-copy"); // duplicates the higher-value keepable page
    expect(reason("/learn/pm/deep-copy")).toMatch(/^dup-of-kept:\/learn\/pm\/deep/);
    expect(keep).not.toContain("/learn/pm/shallow");
    expect(reason("/learn/pm/shallow")).toBe(""); // cut by value alone, no judgment reason
    expect(m.rewrite).toEqual([{ path: "/hand-built-shallow", value: 1.4, thin: 0.6 }]);
    expect(m.valuePass).toMatchObject({ applied: true, scored: 4, keepable: 3, rewrite: 1, rescued: 2, dupAmongKeepable: 1 });
    expect(m.counts).toMatchObject({ keep: 4, noindex: 2, visiblePctAfter: 25 });
  });
});
