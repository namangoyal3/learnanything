import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Electronics E-commerce (2026) — Croma, Reliance Digital, Amazon Electronics PM | PM Streak",
  description:
    "How PMs build electronics e-commerce. Compare, finance, warranty, and why electronics is a high-AOV, low-margin, trust-heavy category.",
  keywords: [
    "PM electronics ecommerce", "Croma PM",
    "Reliance Digital PM 2026",
  ],
  alternates: { canonical: "/pm-electronics-ecommerce" },
  openGraph: {
    title: "PM Electronics E-commerce 2026 — PM Streak",
    description: "How PMs build electronics e-commerce.",
    url: `${SITE_URL}/pm-electronics-ecommerce`,
    type: "article",
  },
};

const DYNAMICS = [
  "Compare UX is critical — users research before buying",
  "EMI and no-cost EMI drive conversion in India",
  "Warranty and service are the moat — Croma&apos;s bet",
  "High AOV + thin margins = logistics quality matters",
  "Category launches (iPhone, Pixel) drive DAU spikes",
];

const METRICS = [
  "Compare-to-purchase conversion",
  "EMI adoption rate",
  "Warranty redemption SLA",
  "Return rate (damage in transit)",
  "Repeat rate (electronics is lower than FMCG)",
];

const FAQS = [
  {
    q: "Can omnichannel electronics retailers compete with pure-play e-commerce?",
    a: "Yes, and increasingly. Croma and Reliance Digital use stores for trial and service, web/app for research and convenience. Pure online players struggle on post-purchase service in India. Omnichannel plus financing depth (Bajaj Finserv, Paytm Postpaid) can win against Amazon and Flipkart.",
  },
];

export default function PmElectronicsEcommercePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Electronics E-commerce", url: `${SITE_URL}/pm-electronics-ecommerce` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📱</span> Electronics is high AOV, low margin, trust-heavy
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Electronics E-commerce<br />(India Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for electronics e-commerce PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Electronics PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Electronics PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
