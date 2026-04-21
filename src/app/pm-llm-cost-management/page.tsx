import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM LLM Cost Management (2026) — Keeping AI Products Profitable | PM Streak",
  description:
    "How PMs manage LLM costs. Caching, model selection, prompt compression, and unit economics that don&apos;t collapse at scale.",
  keywords: [
    "PM LLM cost", "AI cost management 2026",
  ],
  alternates: { canonical: "/pm-llm-cost-management" },
  openGraph: {
    title: "PM LLM Cost Management 2026 — PM Streak",
    description: "Keeping AI products profitable.",
    url: `${SITE_URL}/pm-llm-cost-management`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+LLM+Cost+Management+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM LLM Cost Management 2026 — PM Streak",
    description: "Keeping AI products profitable.",
    images: [`${SITE_URL}/api/og?title=PM+LLM+Cost+Management+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const LEVERS = [
  "Cache aggressively — repeated queries shouldn&apos;t hit the model",
  "Route by complexity — small model for simple, big model for hard",
  "Compress prompts — fewer tokens = lower cost",
  "Batch when latency allows",
  "Negotiate enterprise pricing once volume is real",
];

const PRICING_TRAPS = [
  "Flat-rate pricing on usage-heavy users",
  "No fair-use cap on power users",
  "Forgetting fine-tuning increases per-request cost",
  "Over-using top-tier models for simple tasks",
];

const FAQS = [
  {
    q: "What&apos;s a healthy gross margin for AI products in 2026?",
    a: "Targeting 60–70%+ for SaaS-shaped AI products. Below 50% becomes hard to defend at scale. Cost engineering (caching, routing, prompt compression) typically adds 10–30 points of margin without quality regression. PMs who don&apos;t engage with cost end up with venture-funded but unprofitable products.",
  },
];

export default function PmLlmCostManagementPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM LLM Cost Management", url: `${SITE_URL}/pm-llm-cost-management` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>💸</span> Cost engineering is product engineering for AI
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM LLM Cost Management<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 cost levers and 4 pricing traps for AI product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI Cost PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Cost Levers</h2>
          <div className="space-y-2">
            {LEVERS.map((l, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{l}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Pricing Traps</h2>
            <div className="space-y-2">
              {PRICING_TRAPS.map((p, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{p}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Cost PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
