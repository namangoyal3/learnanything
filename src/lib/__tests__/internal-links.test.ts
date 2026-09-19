/**
 * Internal-linking playbook (§6) — pure helpers only, no network.
 * The Jev judgments are mocked by construction: these tests feed the code
 * paths the probabilities Jev would return and check the deterministic part.
 */
import { describe, it, expect } from "vitest";
// @ts-ignore — plain .mjs module without type declarations
import { splitSentences, anchorWindows, pickAnchor, applyToMarkdown, applyToTsx, tsxProse, findSpan, tokens } from "../../../scripts/seo/internal-links-lib.mjs";

const DEST = "/product-sense-interview";

describe("candidate generation (select, never generate)", () => {
  it("keeps prose sentences and drops bullets, shouting and fragments", () => {
    const text =
      "Product sense rounds test how you reason about users. → Step one • Step two. THE BIG HEADING OF THIS PAGE IS HERE NOW. Short one. Most candidates fail because they jump to solutions before framing the problem clearly.";
    const s = splitSentences(text);
    expect(s).toEqual([
      "Product sense rounds test how you reason about users.",
      "Most candidates fail because they jump to solutions before framing the problem clearly.",
    ]);
  });

  it("proposes 2–5 word windows that never start or end on a stopword", () => {
    const wins = anchorWindows("Most candidates fail the product sense interview because they skip framing.", tokens("product sense interview"), 24);
    expect(wins[0]).toBe("product sense interview");
    for (const w of wins) {
      const words = w.split(" ");
      expect(words.length).toBeGreaterThanOrEqual(2);
      expect(words.length).toBeLessThanOrEqual(5);
      expect(["the", "because", "they"]).not.toContain(words[0].toLowerCase());
      expect(["the", "because", "they"]).not.toContain(words.at(-1)!.toLowerCase());
    }
  });

  it("extracts string literals and JSX text from a static page", () => {
    const src = `const A = [{ what: "Two-way door decisions should be made fast, by fewer people, with less analysis." }];
      <p className="x">A concrete, week-by-week plan from zero to your first PM role. No fluff.</p>`;
    const prose = tsxProse(src);
    expect(prose).toHaveLength(2);
    expect(prose[0]).toMatch(/^Two-way door/);
    expect(prose[1]).toMatch(/^A concrete/);
  });
});

describe("hack 8 — vary link text", () => {
  const probs = { "product sense interview": 0.6, "product sense round": 0.5, "framing the problem": 0.1 };
  it("takes the top phrase when unused", () => {
    expect(pickAnchor(probs, new Set(), 0.8)).toEqual({ anchor: "product sense interview", prob: 0.6 });
  });
  it("prefers an unused runner-up within the ratio", () => {
    expect(pickAnchor(probs, new Set(["product sense interview"]), 0.8)).toEqual({ anchor: "product sense round", prob: 0.5 });
  });
  it("falls back to the top phrase when the runner-up is too weak", () => {
    expect(pickAnchor(probs, new Set(["product sense interview", "product sense round"]), 0.8)?.anchor).toBe("product sense interview");
  });
});

describe("apply — markdown article body", () => {
  const body = "## Intro\n\nMost candidates fail the **product sense** interview because they skip framing.\n\nAnother paragraph here that is long enough.";
  it("links the anchor verbatim inside the matched sentence", () => {
    const r = applyToMarkdown(body, "Most candidates fail the product sense interview because they skip framing.", "skip framing", DEST);
    expect(r.ok).toBe(true);
    expect(r.body).toContain("because they [skip framing](/product-sense-interview).");
  });
  it("refuses an anchor that spans markdown markup", () => {
    const r = applyToMarkdown(body, "Most candidates fail the product sense interview because they skip framing.", "product sense interview", DEST);
    expect(r).toMatchObject({ ok: false, reason: "anchor spans markup" });
  });
  it("refuses a sentence that already links", () => {
    const linked = body.replace("skip framing", "[skip framing](/x)");
    const r = applyToMarkdown(linked, "Most candidates fail the product sense interview because they skip framing.", "skip framing", DEST);
    expect(r.ok).toBe(false);
  });
});

describe("apply — static page TSX", () => {
  const src = `import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  description: "Most candidates fail the product sense interview because they skip framing.",
};

const FAQS = [{ q: "Why?", a: "Most candidates fail the product sense interview because they skip framing." }];
const MOVES = [
  { move: "Frame first", why: "Most candidates fail the product sense interview because they skip framing." },
];

export default function Page() {
  return (
    <main>
      <p className="lead">
        A concrete, week-by-week plan from zero to your first PM role.
      </p>
      {MOVES.map((m) => (<p key={m.move}>{m.why}</p>))}
      {FAQS.map((f) => (<p key={f.q}>{f.a}</p>))}
    </main>
  );
}
`;
  it("wraps a JSX text node in <Link> and adds the import", () => {
    const r = applyToTsx(src, "A concrete, week-by-week plan from zero to your first PM role.", "first PM role", "/how-to-become-a-product-manager");
    expect(r).toMatchObject({ ok: true, mode: "jsx" });
    expect(r.src).toContain('your <Link href="/how-to-become-a-product-manager">first PM role</Link>.');
    expect(r.src).toContain('import Link from "next/link";');
  });
  it("refuses a sentence that appears more than once (metadata + FAQ + prose)", () => {
    const r = applyToTsx(src, "Most candidates fail the product sense interview because they skip framing.", "product sense interview", DEST);
    expect(r).toMatchObject({ ok: false, reason: "sentence ambiguous" });
  });
  it("rewrites a const-array literal and wraps its render site in linkify()", () => {
    const one = src.replace(/export const metadata[\s\S]*?\n};\n/, "").replace(/const FAQS[^\n]*\n/, "").replace(/\s*\{FAQS\.map[^\n]*\n/, "\n");
    const r = applyToTsx(one, "Most candidates fail the product sense interview because they skip framing.", "product sense interview", DEST);
    expect(r).toMatchObject({ ok: true, mode: "literal", field: "why" });
    expect(r.src).toContain("fail the [product sense interview](/product-sense-interview) because");
    expect(r.src).toContain("{linkify(m.why)}");
    expect(r.src).toContain('import { linkify } from "@/components/Linkify";');
  });
  it("refuses FAQ fields because faqSchema() mirrors them into JSON-LD", () => {
    const one = src.replace(/export const metadata[\s\S]*?\n};\n/, "").replace(/const MOVES[\s\S]*?\];\n/, "").replace(/\s*\{MOVES\.map[^\n]*\n/, "\n");
    const r = applyToTsx(one, "Most candidates fail the product sense interview because they skip framing.", "product sense interview", DEST);
    expect(r).toMatchObject({ ok: false, reason: "field a feeds schema" });
  });
  it("matches across entities and whitespace", () => {
    const hay = 'x: "Bezos&apos; 70% rule works\n    when you decide"';
    expect(findSpan(hay, "Bezos' 70% rule works when you decide")).toMatchObject({ start: 4 });
  });
});
