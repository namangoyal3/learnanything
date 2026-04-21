import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Media Products (2026) — Spotify, Netflix, JioCinema PM Lessons | PM Streak",
  description:
    "How PMs build streaming and media products. Content vs catalog, recommendations, ads vs subscription, and the economics of attention.",
  keywords: [
    "PM media products", "streaming PM",
    "OTT PM", "Netflix PM 2026",
  ],
  alternates: { canonical: "/pm-media-products" },
  openGraph: {
    title: "PM Media Products 2026 — PM Streak",
    description: "How PMs build streaming and media products.",
    url: `${SITE_URL}/pm-media-products`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Media+Products+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Media Products 2026 — PM Streak",
    description: "How PMs build streaming and media products.",
    images: [`${SITE_URL}/api/og?title=PM+Media+Products+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Content is the product — interface is a distant second",
  "Recommendation beats search — users lean back, not forward",
  "Catalog breadth vs depth — a few great titles beat a long tail of mediocre",
  "Ads vs subscription vs hybrid — each has different product implications",
  "Regional content wins regional markets — local-language is not optional in India",
];

const METRICS = [
  "Watch time per DAU",
  "Retention D7, D30, D90",
  "Content engagement distribution — heads vs long tail",
  "Ad load tolerance before churn",
  "Subscription renewal rate",
];

const FAQS = [
  {
    q: "Is Indian OTT a winnable market?",
    a: "Yes, but margins are thin and competition is fierce. JioCinema, Disney+ Hotstar, Netflix, Amazon Prime Video, SonyLIV, ZEE5 all compete. Wins come from differentiated content (live sports, regional originals), pricing innovation (mobile-only tiers), and distribution (telco bundles). Pure-play streaming without a content or distribution edge struggles.",
  },
];

export default function PmMediaProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Media Products", url: `${SITE_URL}/pm-media-products` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎬</span> Media products live or die on content. UX comes second.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Media Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for streaming and media PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Media PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Media PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
