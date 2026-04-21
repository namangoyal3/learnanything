import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Strategy Docs (2026) — How PMs Write Strategy Docs That Actually Shape Decisions | PM Streak",
  description:
    "How PMs write strategy docs. Framing, bets, non-goals, and why most strategy docs describe status instead of forcing choices.",
  keywords: [
    "PM strategy docs", "product strategy",
    "strategy document PM 2026",
  ],
  alternates: { canonical: "/pm-strategy-docs" },
  openGraph: {
    title: "PM Strategy Docs 2026 — PM Streak",
    description: "How PMs write strategy docs that shape decisions.",
    url: `${SITE_URL}/pm-strategy-docs`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Strategy+Docs+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Strategy Docs 2026 — PM Streak",
    description: "How PMs write strategy docs that shape decisions.",
    images: [`${SITE_URL}/api/og?title=PM+Strategy+Docs+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const SECTIONS = [
  "Context — the situation honestly. Where are we, what changed?",
  "Objectives — 1–3 outcomes we&apos;re trying to achieve",
  "Bets — the choices we&apos;re making and why",
  "Non-goals — explicit things we&apos;re not doing and why not",
  "Key risks — what could break this plan?",
  "Measures — how we&apos;ll know if it worked",
];

const RULES = [
  "A strategy doc forces choices — if it doesn&apos;t say no to anything, it&apos;s not a strategy",
  "Write it so a new hire can understand it in 15 minutes",
  "Get red-team review from skeptics before wide release",
  "Revisit quarterly — strategy docs that don&apos;t evolve become fiction",
];

const FAQS = [
  {
    q: "How long should a strategy doc be?",
    a: "3–8 pages for a product. 1–2 pages for a feature. More than 10 pages and nobody reads it; fewer than 1 and you probably haven&apos;t thought it through. The best strategy docs are short because the thinking is rigorous, not because the writing is terse.",
  },
];

export default function PmStrategyDocsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Strategy Docs", url: `${SITE_URL}/pm-strategy-docs` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🧭</span> Strategy forces choices. If it doesn&apos;t say no, it isn&apos;t strategy.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Strategy Docs<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            6 sections and 4 rules for strategy docs that actually shape decisions.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Strategy PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 Sections</h2>
          <div className="space-y-2">
            {SECTIONS.map((s, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{s}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Rules</h2>
            <div className="space-y-2">
              {RULES.map((r, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{r}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-8">FAQ</h2>
          <div className="space-y-5">
            {FAQS.map(faq => (
              <div key={faq.q} className="border border-white/10 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-white/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
          <h2 className="text-2xl font-bold mb-3">Practice Strategy Doc Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
