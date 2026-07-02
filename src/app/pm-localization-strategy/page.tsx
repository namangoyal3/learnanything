import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Localization Strategy (2026) — When and How to Localize",
  description:
    "How PMs decide where and how to localize. Language vs full localization, ROI sequencing, and AI-assisted translation pipelines.",
  keywords: [
    "PM localization", "L10n PM 2026",
  ],
  alternates: { canonical: "/pm-localization-strategy" },
  openGraph: {
    title: "PM Localization Strategy 2026 — PM Streak",
    description: "When and how to localize.",
    url: `${SITE_URL}/pm-localization-strategy`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Localization+Strategy+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Localization Strategy 2026 — PM Streak",
    description: "When and how to localize.",
    images: [`${SITE_URL}/api/og?title=PM+Localization+Strategy+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const TIERS = [
  "Tier 1 — translate UI strings only",
  "Tier 2 — translate + adapt content for cultural fit",
  "Tier 3 — full localization with local payments, support, legal",
];

const SEQUENCE = [
  "Start with one or two markets where ROI is clear",
  "Hire local CS first, even before localized UI",
  "Translate critical paths before everything",
  "Use AI for first pass, human review for high-impact strings",
  "Measure outcomes in market, not output of translation",
];

const FAQS = [
  {
    q: "How do PMs prioritise which languages to localize first?",
    a: "Three signals: existing user base demand, addressable market size, regulatory or cultural necessity. Spanish, Portuguese, German, French often top the global priority list. For India entry, Hindi, Tamil, Telugu, Marathi, Bengali, Kannada are the typical tier-1 set. Don&apos;t spread thin — depth in 2 languages beats shallow in 10.",
  },
];

export default function PmLocalizationStrategyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Localization Strategy", url: `${SITE_URL}/pm-localization-strategy` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🌍</span> Depth in 2 languages beats shallow in 10
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Localization Strategy<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            3 localization tiers and a 5-step sequence.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Localization PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">3 Tiers</h2>
          <div className="space-y-2">
            {TIERS.map((t, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{t}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5-Step Sequence</h2>
            <div className="space-y-2">
              {SEQUENCE.map((s, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{s}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Localization PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
