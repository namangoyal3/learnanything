import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Pricing Strategy (2026) — How PMs Set and Change Prices",
  description:
    "How PMs approach pricing — value-based, usage-based, tiered, freemium. Frameworks, willingness-to-pay research, and how to run pricing experiments.",
  keywords: [
    "PM pricing strategy", "product pricing PM",
    "pricing experiments", "value-based pricing 2026",
  ],
  alternates: { canonical: "/pm-pricing-strategy" },
  openGraph: {
    title: "PM Pricing Strategy 2026 — PM Streak",
    description: "How PMs set and change prices — frameworks, research, experiments.",
    url: `${SITE_URL}/pm-pricing-strategy`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Pricing+Strategy+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Pricing Strategy 2026 — PM Streak",
    description: "How PMs set and change prices — frameworks, research, experiments.",
    images: [`${SITE_URL}/api/og?title=PM+Pricing+Strategy+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const MODELS = [
  { model: "Freemium", fit: "Consumer and prosumer, viral products where free users drive acquisition." },
  { model: "Usage-based", fit: "APIs, infra, AI — when cost scales with customer value delivered." },
  { model: "Tiered (Good/Better/Best)", fit: "B2B SaaS — lets segments self-select." },
  { model: "Per-seat", fit: "Collaboration tools where value scales with team size." },
  { model: "Flat-rate", fit: "Simplicity wins in crowded markets; predictable revenue." },
];

const FRAMEWORKS = [
  "Van Westendorp — survey users on too-cheap, cheap, expensive, too-expensive prices",
  "Gabor-Granger — test willingness-to-pay at specific price points",
  "Conjoint analysis — quantify relative value of features and price combinations",
  "Value-based anchoring — price to % of value customer captures, not cost",
  "Competitor benchmarking — know the reference price in your category",
];

const TRAPS = [
  "Pricing by cost-plus — ignores the value customers actually get",
  "Changing prices without grandfathering existing customers — trust killer",
  "Too many tiers — analysis paralysis kills conversion",
  "No annual discount — leaving LTV and cashflow on the table",
  "Hiding prices behind &apos;contact sales&apos; when buyers just want to decide",
];

const FAQS = [
  {
    q: "When should a PM raise prices?",
    a: "When three things are true: your product has measurably improved since last pricing; win rates are high against competitors (suggesting under-pricing); and churn is low (suggesting room for value capture). Raise on new customers first, grandfather existing ones for 6–12 months to preserve trust.",
  },
  {
    q: "Should pricing be owned by PM or finance?",
    a: "PM owns pricing strategy — model, tiers, packaging. Finance owns financial modeling and approval on material changes. Marketing owns price communication. This is a cross-functional call that should never sit with one function alone.",
  },
];

export default function PmPricingStrategyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Pricing Strategy", url: `${SITE_URL}/pm-pricing-strategy` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>💰</span> Pricing is the fastest lever. Also the riskiest.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Pricing Strategy<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 pricing models, 5 research frameworks, and 5 traps to avoid.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Pricing PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Pricing Models</h2>
          <div className="space-y-3">
            {MODELS.map((m, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                <p className="font-semibold text-purple-400 text-sm mb-1">{m.model}</p>
                <p className="text-xs text-white/60">{m.fit}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Research Frameworks</h2>
            <div className="space-y-2">
              {FRAMEWORKS.map((f, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Traps</h2>
          <div className="space-y-2">
            {TRAPS.map((t, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-red-400 flex-shrink-0">❌</span>
                <p className="text-sm text-white/70">{t}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
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
          <h2 className="text-2xl font-bold mb-3">Practice Pricing PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
