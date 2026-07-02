import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM HR Tech (2026) — Darwinbox, Rippling, Keka PM Guide",
  description:
    "How PMs build HR tech products. Payroll, performance, engagement, and the consolidation of point tools into full-suite HRIS.",
  keywords: [
    "PM HR tech", "Darwinbox PM",
    "Rippling PM", "HRIS 2026",
  ],
  alternates: { canonical: "/pm-hr-tech" },
  openGraph: {
    title: "PM HR Tech 2026 — PM Streak",
    description: "How PMs build HR tech products.",
    url: `${SITE_URL}/pm-hr-tech`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+HR+Tech+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM HR Tech 2026 — PM Streak",
    description: "How PMs build HR tech products.",
    images: [`${SITE_URL}/api/og?title=PM+HR+Tech+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Payroll is the anchor — once an org is on your payroll, switching is painful",
  "Compliance is a roadmap input — labour law changes per country, state, even sector",
  "Point tools are consolidating — suite plays winning mid-market",
  "Employee experience matters, but buyer is HR/finance — dual UX",
  "AI is rewriting recruitment, performance, and engagement workflows",
];

const METRICS = [
  "Payroll accuracy (errors per 10k paychecks)",
  "Compliance filings on time",
  "Employee weekly active usage (signal of real adoption)",
  "Admin-to-employee ratio — how lean can HR run?",
  "Module attach rate (payroll + performance + engagement)",
];

const FAQS = [
  {
    q: "Is Indian HR tech a winnable market?",
    a: "Yes, increasingly. Darwinbox, Keka, Zoho People serve Indian mid-market; Rippling and Deel expanding here. Wins come from compliance depth (ESI, PF, PT, TDS), local languages, and integration with Indian banking. Suite strategies (payroll + performance + engagement) outperform point tools.",
  },
];

export default function PmHrTechPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM HR Tech", url: `${SITE_URL}/pm-hr-tech` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>👔</span> Payroll is the anchor. Everything else expands from there.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM HR Tech<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for HR tech PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build HR Tech PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice HR Tech PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
