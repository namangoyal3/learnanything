import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Ride-Hailing (2026) — Uber, Ola, Rapido PM Guide | PM Streak",
  description:
    "How PMs build ride-hailing products. Dispatch, dynamic pricing, driver supply, and the peculiar economics of two-sided mobility marketplaces.",
  keywords: [
    "PM ride-hailing", "Uber PM",
    "Ola PM", "Rapido PM 2026",
  ],
  alternates: { canonical: "/pm-ride-hailing" },
  openGraph: {
    title: "PM Ride-Hailing 2026 — PM Streak",
    description: "How PMs build ride-hailing products.",
    url: `${SITE_URL}/pm-ride-hailing`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Ride-Hailing+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Ride-Hailing 2026 — PM Streak",
    description: "How PMs build ride-hailing products.",
    images: [`${SITE_URL}/api/og?title=PM+Ride-Hailing+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Dispatch is the product — matching rider to driver in seconds",
  "Dynamic pricing balances supply and demand — surge is a tool, not a tax",
  "Driver supply is the constraint — riders will wait; drivers won&apos;t",
  "Geographic liquidity — marketplace health is hyperlocal",
  "Two-wheeler is a distinct category in India — Rapido rewrote economics",
];

const METRICS = [
  "ETA accuracy (predicted vs actual pickup)",
  "Ride completion rate",
  "Driver earnings per hour",
  "Cancellation rate (rider and driver)",
  "Repeat ride rate",
];

const FAQS = [
  {
    q: "Is ride-hailing PM still a good path in 2026?",
    a: "Mature but still evolving. Core ride-hailing is now 15+ years in. Growth comes from adjacent categories — auto, bike taxi, intercity, EV fleets. PMs in this space work on hard systems problems (dispatch, pricing) that transfer well to quick commerce and logistics roles.",
  },
];

export default function PmRideHailingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Ride-Hailing", url: `${SITE_URL}/pm-ride-hailing` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🚕</span> Dispatch is the product. Everything else is polish.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Ride-Hailing<br />(India Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for ride-hailing PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Mobility PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Mobility PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
