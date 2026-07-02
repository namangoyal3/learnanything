import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM CRM Products (2026) — Salesforce, HubSpot, Attio PM Guide",
  description:
    "How PMs build CRM products. Pipeline UX, data quality, integrations, and why CRM is the highest-switching-cost category in SaaS.",
  keywords: [
    "PM CRM products", "Salesforce PM",
    "HubSpot PM", "CRM 2026",
  ],
  alternates: { canonical: "/pm-crm-products" },
  openGraph: {
    title: "PM CRM Products 2026 — PM Streak",
    description: "How PMs build CRM products.",
    url: `${SITE_URL}/pm-crm-products`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+CRM+Products+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM CRM Products 2026 — PM Streak",
    description: "How PMs build CRM products.",
    images: [`${SITE_URL}/api/og?title=PM+CRM+Products+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Data quality is the product — garbage in, garbage everywhere",
  "Pipeline UX must match the rep&apos;s mental model — not the manager&apos;s",
  "Integrations are existential — CRMs without Gmail/Outlook are dead on arrival",
  "AI is rewriting the category — enrichment, summarisation, next-best-action",
  "Switching cost is extreme — once data is in, leaving is painful",
];

const METRICS = [
  "Daily active reps (not licensed seats)",
  "Data completeness score per record",
  "Time from meeting to logged activity",
  "AI-assisted task adoption rate",
  "Admin-to-rep ratio — how much manual config does it take?",
];

const FAQS = [
  {
    q: "Can new CRMs still break into this market?",
    a: "Yes — Attio, Folk, and Copper show there&apos;s room at the edges. New entrants win on specific segments (founder-led sales, creator economy, SMB services). Displacing Salesforce at enterprise is near-impossible; growing alongside it in underserved niches is where opportunity lives.",
  },
];

export default function PmCrmProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM CRM Products", url: `${SITE_URL}/pm-crm-products` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📇</span> CRM is the highest-switching-cost category in SaaS
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM CRM Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for CRM product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build CRM PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Dynamics</h2>
          <div className="space-y-2">
            {DYNAMICS.map((d, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Metrics</h2>
            <div className="space-y-2">
              {METRICS.map((m, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
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
          <h2 className="text-2xl font-bold mb-3">Practice CRM PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
