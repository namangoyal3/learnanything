import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Beauty Tech (2026) — Nykaa, Purplle, Tira PM Guide | PM Streak",
  description:
    "How PMs build beauty tech products. Content-led commerce, AR try-ons, influencer ecosystems, and why beauty blends media and marketplace.",
  keywords: [
    "PM beauty tech", "Nykaa PM",
    "Purplle PM", "Tira PM 2026",
  ],
  alternates: { canonical: "/pm-beauty-tech" },
  openGraph: {
    title: "PM Beauty Tech 2026 — PM Streak",
    description: "How PMs build beauty tech products.",
    url: `${SITE_URL}/pm-beauty-tech`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Beauty+Tech+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Beauty Tech 2026 — PM Streak",
    description: "How PMs build beauty tech products.",
    images: [`${SITE_URL}/api/og?title=PM+Beauty+Tech+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Content + commerce is the moat — reviews, tutorials, swatches",
  "AR try-on is table stakes for makeup — less mature for skincare",
  "Influencer ecosystem drives discovery more than search",
  "Own-label plus marketplace is the dominant model",
  "Premium and masstige segments behave very differently",
];

const METRICS = [
  "Repeat rate at 60 and 90 days",
  "Review density per SKU",
  "AR try-on to purchase conversion",
  "Own-label share of GMV",
  "Influencer-driven traffic conversion",
];

const FAQS = [
  {
    q: "Why is Indian beauty tech so Nykaa-dominant?",
    a: "Because they built content moats (reviews, tutorials, masterclasses), own-label expansion, and offline-online hybrid distribution early. Competitors (Purplle, Tira, Myntra Beauty) have respectable share but break-out is hard when one player owns both trust and selection at scale.",
  },
];

export default function PmBeautyTechPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Beauty Tech", url: `${SITE_URL}/pm-beauty-tech` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>💄</span> Beauty is part media, part marketplace — design for both
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Beauty Tech<br />(India Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for beauty tech PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Beauty PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Beauty PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
