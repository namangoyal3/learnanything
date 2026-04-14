import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Grocery Tech (2026) — BigBasket, Amazon Fresh, Zepto PM Guide | PM Streak",
  description:
    "How PMs build grocery tech products. SKU depth, substitution, fresh delivery, and why grocery has the hardest fulfillment math in e-commerce.",
  keywords: [
    "PM grocery tech", "BigBasket PM",
    "Amazon Fresh PM", "grocery 2026",
  ],
  alternates: { canonical: "/pm-grocery-tech" },
  openGraph: {
    title: "PM Grocery Tech 2026 — PM Streak",
    description: "How PMs build grocery tech products.",
    url: `${SITE_URL}/pm-grocery-tech`,
    type: "article",
  },
};

const DYNAMICS = [
  "SKU depth beats catalogue breadth — users want their brand, not an alternative",
  "Substitution UX matters — out-of-stock is frequent; replace gracefully",
  "Fresh and frozen are distinct operations — don&apos;t mix them in ops",
  "Basket size over AOV — groceries are routine; increase frequency and depth",
  "Quick commerce is eating scheduled delivery — BigBasket had to adapt",
];

const METRICS = [
  "Fill rate (% of ordered SKUs actually delivered)",
  "Substitution acceptance rate",
  "Average basket size and order frequency",
  "Freshness / quality complaint rate",
  "Repeat rate at 60 days",
];

const FAQS = [
  {
    q: "Is scheduled grocery delivery dying in favor of quick commerce?",
    a: "Not dying, but shrinking share. Large baskets and monthly stock-ups still fit scheduled; top-ups and impulse buys go to quick commerce. Hybrid models (Instamart, BigBasket Now) acknowledge this. Pure-play scheduled grocery is being squeezed from both sides.",
  },
];

export default function PmGroceryTechPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Grocery Tech", url: `${SITE_URL}/pm-grocery-tech` },
        { name: "Home", url: SITE_URL },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🥦</span> Grocery is the hardest fulfillment math in e-commerce
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Grocery Tech<br />(India Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for grocery tech PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Grocery PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Grocery PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
