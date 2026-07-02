import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM x Sales Ops (2026) — Working With Sales Operations as a PM",
  description:
    "How PMs partner with sales operations. Pipeline data, forecast accuracy, deal desk, and why sales ops is a rich PM research channel.",
  keywords: [
    "PM sales ops", "revenue operations",
    "sales ops PM 2026",
  ],
  alternates: { canonical: "/pm-sales-ops" },
  openGraph: {
    title: "PM x Sales Ops 2026 — PM Streak",
    description: "How PMs partner with sales operations.",
    url: `${SITE_URL}/pm-sales-ops`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+x+Sales+Ops+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM x Sales Ops 2026 — PM Streak",
    description: "How PMs partner with sales operations.",
    images: [`${SITE_URL}/api/og?title=PM+x+Sales+Ops+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const PRACTICES = [
  "Attend weekly forecast meetings — pipeline reveals which features gate deals",
  "Review deal desk exceptions — customer asks drive roadmap signal",
  "Partner on CRM data quality — bad data hurts everyone",
  "Analyse win/loss decks — verbatim customer language",
  "Tour sales calls monthly — 2 calls, 30 minutes each",
];

const SIGNALS = [
  "Feature-gated deals — how many deals blocked on unshipped work?",
  "Win rate vs key competitors — where we&apos;re losing",
  "Time-to-first-value for new customers — leading indicator of expansion",
  "Sales cycle length trend — compressing or stretching?",
  "Churn reasons tagged at renewal — product vs service vs price",
];

const FAQS = [
  {
    q: "Why should PMs engage with sales ops?",
    a: "Sales ops sits on the richest customer data in the company — which deals are won, which are lost, why, and for how much. PMs who engage with this data ship features aligned with revenue impact. PMs who ignore it ship based on vibes and feedback loops that don&apos;t connect to money.",
  },
];

export default function PmSalesOpsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Sales Ops", url: `${SITE_URL}/pm-sales-ops` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>💼</span> Sales ops has the richest customer data. PMs should be in it.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM x Sales Ops<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 practices and 5 signals for PM-sales ops partnership.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Sales Ops Partnership Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Practices</h2>
          <div className="space-y-2">
            {PRACTICES.map((p, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Signals</h2>
            <div className="space-y-2">
              {SIGNALS.map((s, i) => (
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
          <h2 className="text-2xl font-bold mb-3">Practice PM-Sales Ops Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
