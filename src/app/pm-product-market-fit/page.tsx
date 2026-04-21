import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Product-Market Fit (2026) — How to Know If You Have It (and What to Do If You Don&apos;t) | PM Streak",
  description:
    "How PMs recognise product-market fit. Leading indicators, the Sean Ellis test, retention curves, and what to do if PMF isn&apos;t there yet.",
  keywords: [
    "PM product market fit", "PMF signals",
    "Sean Ellis test", "achieving PMF",
    "product market fit 2026",
  ],
  alternates: { canonical: "/pm-product-market-fit" },
  openGraph: {
    title: "PM Product-Market Fit 2026 — PM Streak",
    description: "How PMs know they have PMF, what signals to watch, what to do if they don&apos;t.",
    url: `${SITE_URL}/pm-product-market-fit`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Product-Market+Fit+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Product-Market Fit 2026 — PM Streak",
    description: "How PMs know they have PMF, what signals to watch, what to do if they don&apos;t.",
    images: [`${SITE_URL}/api/og?title=PM+Product-Market+Fit+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const PMF_SIGNALS = [
  "Retention curve flattens — users stick around past a natural threshold",
  "Organic growth begins — referrals, word-of-mouth without paid",
  "Users complain when features break — they care enough to notice",
  "Sales cycles shorten (B2B) — customers decide faster when fit is right",
  "The Sean Ellis test: &gt;40% of users say they&apos;d be &apos;very disappointed&apos; without the product",
  "Usage grows faster than marketing spend — leading indicator of compounding",
];

const EARLY_VS_LATE = [
  { stage: "Pre-PMF", traits: "Inconsistent feedback, volatile retention, every day feels different" },
  { stage: "Approaching PMF", traits: "Some users love it deeply; others bounce. Retention uneven across segments." },
  { stage: "PMF achieved", traits: "Retention curve flattens; users self-refer; demand consistent across new cohorts" },
  { stage: "Past PMF, scaling", traits: "Demand outpaces capacity; focus shifts from finding to widening" },
];

const IF_NOT_PMF = [
  "Don&apos;t scale — scaling a product without PMF wastes acquisition spend",
  "Narrow your target user — maybe you have PMF with a subset you haven&apos;t recognised",
  "Do deep user research — 5 users deeply beats 50 surveys",
  "Kill features that don&apos;t retain — broader doesn&apos;t mean better",
  "Consider a pivot — honest assessment: is the problem worth solving?",
  "Give it time — PMF rarely happens in 6 months; 12–24 is more realistic",
];

const PMF_MYTHS = [
  "PMF is a binary state — actually, it&apos;s a spectrum across segments",
  "If you build it, users will come — no, they won&apos;t; distribution matters",
  "Growth means PMF — growth can be fueled by paid acquisition at a loss",
  "More features = more PMF — often the reverse; focus reveals PMF",
  "PMF lasts forever — markets shift; you can lose PMF if you stop iterating",
];

const FAQS = [
  {
    q: "How do PMs know they&apos;ve reached PMF?",
    a: "The best signal: users get upset when the product breaks. If users don&apos;t care, you don&apos;t have PMF — even if metrics look fine. Combined with flattening retention curves and organic growth, caring users is the clearest signal you&apos;ve built something real.",
  },
  {
    q: "What&apos;s the biggest PMF mistake PMs make?",
    a: "Claiming PMF too early. Early growth from paid marketing or press spikes looks like PMF but isn&apos;t. True PMF is visible in retention and organic referrals. PMs who confuse growth with PMF scale prematurely and burn cash chasing growth that doesn&apos;t compound.",
  },
];

export default function PmProductMarketFitPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Product-Market Fit", url: `${SITE_URL}/pm-product-market-fit` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎯</span> PMF is the only metric that matters pre-scale
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Product-Market Fit<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            6 PMF signals, 4 stages of PMF, 6 things to do if PMF isn&apos;t there, and 5 common PMF myths.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Judgment Daily — Free →
          </Link>
        </section>

        {/* Signals */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 PMF Signals</h2>
          <div className="space-y-2">
            {PMF_SIGNALS.map((s, i) => (
              <div key={i} className="bg-[#111] border border-green-500/20 rounded-xl p-3 flex gap-3">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <p className="text-sm text-white/70">{s}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stages */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Stages of PMF</h2>
            <div className="space-y-3">
              {EARLY_VS_LATE.map((e, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                  <p className="font-semibold text-purple-400 text-sm mb-1">{e.stage}</p>
                  <p className="text-xs text-white/60">{e.traits}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* If not PMF */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 Moves If PMF Isn&apos;t There Yet</h2>
          <div className="space-y-2">
            {IF_NOT_PMF.map((m, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{m}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Myths */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 PMF Myths</h2>
            <div className="space-y-2">
              {PMF_MYTHS.map((m, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{m}</p>
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
          <h2 className="text-2xl font-bold mb-3">Build PM Judgment Daily</h2>
          <p className="text-white/60 mb-6">Daily scenarios on PMF, retention, and deciding when to scale.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
