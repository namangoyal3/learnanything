import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM E-commerce India (2026) — Flipkart, Amazon, Meesho PM Guide",
  description:
    "How PMs build e-commerce products in India. COD, RTO, Tier-2/3, social commerce, and the brutal unit economics of Indian e-commerce.",
  keywords: [
    "PM ecommerce india", "Flipkart PM",
    "Meesho PM", "Amazon india PM 2026",
  ],
  alternates: { canonical: "/pm-ecommerce-india" },
  openGraph: {
    title: "PM E-commerce India 2026 — PM Streak",
    description: "How PMs build e-commerce products in India.",
    url: `${SITE_URL}/pm-ecommerce-india`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+E-commerce+India+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM E-commerce India 2026 — PM Streak",
    description: "How PMs build e-commerce products in India.",
    images: [`${SITE_URL}/api/og?title=PM+E-commerce+India+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "COD is still huge — payment mix shapes refund, RTO, and unit economics",
  "Return-to-origin (RTO) kills margin — address quality and trust matter",
  "Tier-2/3 growth is the real game — Meesho rewired the playbook",
  "Vernacular UX unlocks segments English-only platforms miss",
  "Social commerce (WhatsApp, Instagram) is fragmenting the funnel",
];

const METRICS = [
  "GMV and net GMV after returns",
  "Prepaid ratio",
  "RTO rate by category and pin code",
  "Repeat rate at 90 days",
  "Category contribution margin",
];

const FAQS = [
  {
    q: "Is Indian e-commerce PM still a good career path?",
    a: "Large and still growing, but brutal on unit economics. PMs who love marketplace dynamics, logistics, and consumer behaviour at scale thrive. Skills transfer well to quick commerce, travel, and fintech. The hours are intense; the impact is real; the learning curve is steep.",
  },
];

export default function PmEcommerceIndiaPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM E-commerce India", url: `${SITE_URL}/pm-ecommerce-india` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🛒</span> India e-commerce lives on the margin between COD and RTO
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM E-commerce India<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for Indian e-commerce PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build E-commerce PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice E-commerce PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
