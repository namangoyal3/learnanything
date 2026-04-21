import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Real Estate Tech (2026) — NoBroker, MagicBricks, Housing PM Guide | PM Streak",
  description:
    "How PMs build real estate tech products. Listings quality, broker dynamics, renter vs buyer funnels, and the long-cycle problems of proptech.",
  keywords: [
    "PM real estate", "proptech PM",
    "NoBroker PM", "MagicBricks PM 2026",
  ],
  alternates: { canonical: "/pm-real-estate-tech" },
  openGraph: {
    title: "PM Real Estate Tech 2026 — PM Streak",
    description: "How PMs build real estate tech products.",
    url: `${SITE_URL}/pm-real-estate-tech`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Real+Estate+Tech+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Real Estate Tech 2026 — PM Streak",
    description: "How PMs build real estate tech products.",
    images: [`${SITE_URL}/api/og?title=PM+Real+Estate+Tech+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Listings quality is the moat — fake and stale listings destroy trust",
  "Long purchase cycles — buyers research for 6+ months before closing",
  "Broker dynamics — powerful gatekeepers with counter-incentives",
  "Renter vs buyer funnels are different products — treat them that way",
  "Trust signals matter more than UX — photos, verification, reviews",
];

const METRICS = [
  "Verified listings ratio",
  "Listing freshness — % updated in last 30 days",
  "Inquiry-to-visit conversion",
  "Broker satisfaction (if they&apos;re part of your model)",
  "NPS from closed transactions",
];

const FAQS = [
  {
    q: "Is Indian proptech a winnable market?",
    a: "Niche-by-niche. Rental discovery (NoBroker model) works at scale. Buying remains complicated by brokers, documentation, and trust. Most successful proptech companies pick one slice (rentals, co-living, short-stay, plots) rather than trying to solve all of real estate. Horizontal plays struggle.",
  },
];

export default function PmRealEstateTechPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Real Estate Tech", url: `${SITE_URL}/pm-real-estate-tech` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🏠</span> Listings quality beats UX every time in proptech
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Real Estate Tech<br />(India Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for proptech PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Proptech PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Proptech Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
