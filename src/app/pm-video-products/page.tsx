import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Video Products (2026) — YouTube, TikTok, Reels PM Playbook | PM Streak",
  description:
    "How PMs build video products. Watch time, creator tools, recommendation, monetisation, and the unique engagement dynamics of video.",
  keywords: [
    "PM video products", "YouTube PM",
    "TikTok PM", "Reels PM", "video product 2026",
  ],
  alternates: { canonical: "/pm-video-products" },
  openGraph: {
    title: "PM Video Products 2026 — PM Streak",
    description: "How PMs build video products — watch time, creator tools, recommendation.",
    url: `${SITE_URL}/pm-video-products`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Video+Products+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Video Products 2026 — PM Streak",
    description: "How PMs build video products — watch time, creator tools, recommendation.",
    images: [`${SITE_URL}/api/og?title=PM+Video+Products+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Watch time is the dominant signal — but shallow clicks can game it",
  "Creator tooling beats consumer features — supply side compounds",
  "Recommendation is the product — algorithm changes can reshape entire categories",
  "Vertical video has rewired mobile expectations — horizontal is now the exception",
  "Monetisation split dictates creator loyalty — platform economics drive creator multi-homing",
];

const METRICS = [
  "Watch time per DAU",
  "Session length and session count",
  "Creator upload frequency and retention",
  "Impressions-to-watch rate",
  "Skip rate in the first 3 seconds — the real hook signal",
];

const FAQS = [
  {
    q: "Why is the first 3 seconds so load-bearing in video?",
    a: "Because the cost of swiping is near zero. If the opening doesn&apos;t land, users move on without penalty. Creators and platforms optimise aggressively for the 3-second hook because it gates every downstream metric — watch time, completion, shares.",
  },
];

export default function PmVideoProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Video Products", url: `${SITE_URL}/pm-video-products` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎬</span> Short-form video rewired mobile. The effects are still compounding.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Video Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for video product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Video PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Video PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
