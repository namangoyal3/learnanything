import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Rate Limits (2026) — Designing Quotas Without Breaking Trust | PM Streak",
  description:
    "How PMs design rate limits and quotas for AI products. Tier caps, fair-use, and how to communicate limits without alienating power users.",
  keywords: [
    "PM AI rate limits", "AI quotas 2026",
  ],
  alternates: { canonical: "/pm-ai-rate-limits" },
  openGraph: {
    title: "PM AI Rate Limits 2026 — PM Streak",
    description: "Designing quotas without breaking trust.",
    url: `${SITE_URL}/pm-ai-rate-limits`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+AI+Rate+Limits+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM AI Rate Limits 2026 — PM Streak",
    description: "Designing quotas without breaking trust.",
    images: [`${SITE_URL}/api/og?title=PM+AI+Rate+Limits+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const PRINCIPLES = [
  "Default limits aimed at 95th percentile usage",
  "Communicate limits clearly before users hit them",
  "Soft limits with overage warnings beat hard caps",
  "Reset cadence (hourly vs daily) shapes perception",
  "Enterprise tiers with custom limits reduce friction",
];

const TRAPS = [
  "Surprise rate limits with no warning — trust killer",
  "Vague limits (&apos;fair use&apos;) without specifics",
  "Limits that hit during high-value moments (deadlines)",
  "No way to upgrade in-flow when limits hit",
];

const FAQS = [
  {
    q: "Hard or soft limits for AI products?",
    a: "Soft limits with overage warnings work better in 2026. Hard caps frustrate paying users at the worst moment. Soft limits with clear pricing for overage convert better and reduce churn. Reserve hard caps for true cost protection scenarios, not nudge-to-upgrade tactics.",
  },
];

export default function PmAiRateLimitsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Rate Limits", url: `${SITE_URL}/pm-ai-rate-limits` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🚧</span> Soft limits with warnings beat hard caps
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Rate Limits<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 principles and 4 traps for AI rate limits.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI Rate Limit PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Principles</h2>
          <div className="space-y-2">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Traps</h2>
            <div className="space-y-2">
              {TRAPS.map((t, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{t}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Rate Limit Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
