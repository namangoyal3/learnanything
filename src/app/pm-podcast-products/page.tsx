import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Podcast Products (2026) — Spotify, Apple Podcasts, Pocket Casts PM Lessons | PM Streak",
  description:
    "How PMs build podcast products. RSS vs walled garden, monetisation, discovery, and why the podcast app category is more interesting than it looks.",
  keywords: [
    "PM podcast products", "Spotify podcast PM",
    "podcast app 2026",
  ],
  alternates: { canonical: "/pm-podcast-products" },
  openGraph: {
    title: "PM Podcast Products 2026 — PM Streak",
    description: "How PMs build podcast products.",
    url: `${SITE_URL}/pm-podcast-products`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Podcast+Products+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Podcast Products 2026 — PM Streak",
    description: "How PMs build podcast products.",
    images: [`${SITE_URL}/api/og?title=PM+Podcast+Products+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "RSS openness vs walled gardens — discovery vs monetisation tradeoff",
  "Discovery is weak — users stick with the shows they know",
  "Exclusives are a moat Spotify keeps trying — mixed results",
  "Ads vs subscription monetisation splits creators",
  "AI summarisation and chapter extraction are new product wedges",
];

const METRICS = [
  "Listening hours per DAU",
  "Shows subscribed per user",
  "Completion rate on new episodes",
  "Discovery-to-subscribe conversion",
  "Creator retention on platform",
];

const FAQS = [
  {
    q: "Is podcast app differentiation possible in 2026?",
    a: "At the edges. AI-driven discovery, transcription, chapter extraction (Pocket Casts&apos; features, Overcast&apos;s smart speed) differentiate at the margin. But the core player experience is commoditised. Breakout innovation probably comes from AI-assisted content (summaries, translation, personalised highlights) not the player itself.",
  },
];

export default function PmPodcastProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Podcast Products", url: `${SITE_URL}/pm-podcast-products` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎙️</span> Podcast player UX is commoditised. Differentiation lives next to it.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Podcast Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for podcast product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Podcast PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Podcast PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
