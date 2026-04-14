import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM D2C Brands (2026) — Mamaearth, boAt, Sugar PM Guide | PM Streak",
  description:
    "How PMs build for D2C brands in India. Shopify economics, performance marketing, repeat rate, and what makes D2C PM unique.",
  keywords: [
    "PM D2C", "direct-to-consumer PM",
    "Mamaearth PM", "boAt PM", "D2C india 2026",
  ],
  alternates: { canonical: "/pm-d2c-brands" },
  openGraph: {
    title: "PM D2C Brands 2026 — PM Streak",
    description: "How PMs build for Indian D2C brands.",
    url: `${SITE_URL}/pm-d2c-brands`,
    type: "article",
  },
};

const DYNAMICS = [
  "Performance marketing CAC is the binding constraint — product exists to beat it",
  "Repeat rate is everything — D2C math breaks without it",
  "Content + commerce — brands win by owning the story, not just the SKU",
  "Quick commerce eating share — listings on Zepto/Blinkit are mandatory for FMCG D2C",
  "Offline eventually — pure-online D2C caps out; brands graduate to general trade",
];

const METRICS = [
  "CAC / LTV ratio",
  "Repeat purchase rate at 3, 6, 12 months",
  "Contribution margin per order",
  "RTO / NDR rate — India D2C lives or dies on this",
  "Attribution across Meta, Google, SEO, and organic",
];

const FAQS = [
  {
    q: "Is D2C PM different from e-commerce PM?",
    a: "Yes. E-commerce PMs work on marketplaces where the brand is not theirs. D2C PMs work on a single-brand stack where product, marketing, and retention are tightly coupled. Decisions about pricing, packaging, and acquisition all flow through product. Smaller scale, but broader scope per PM.",
  },
];

export default function PmD2cBrandsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM D2C Brands", url: `${SITE_URL}/pm-d2c-brands` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🛍️</span> D2C PMs own the entire brand stack
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM D2C Brands<br />(India Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for D2C PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build D2C PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice D2C PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
