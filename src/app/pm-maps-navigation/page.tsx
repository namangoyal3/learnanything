import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Maps &amp; Navigation (2026) — Google Maps, MapmyIndia, Apple Maps PM Lessons | PM Streak",
  description:
    "How PMs build maps and navigation products. Routing quality, POI coverage, traffic, and why maps are the most operationally intense consumer category.",
  keywords: [
    "PM maps", "Google Maps PM",
    "navigation PM 2026",
  ],
  alternates: { canonical: "/pm-maps-navigation" },
  openGraph: {
    title: "PM Maps &amp; Navigation 2026 — PM Streak",
    description: "How PMs build maps and navigation products.",
    url: `${SITE_URL}/pm-maps-navigation`,
    type: "article",
  },
};

const DYNAMICS = [
  "Routing quality compounds with data — more users = better routes",
  "POI coverage matters more than visual polish",
  "Traffic data is a network-effect moat",
  "India requires unique solutions — small roads, local shortcuts, vernacular search",
  "MapmyIndia and others compete locally on India-specific data",
];

const METRICS = [
  "ETA accuracy",
  "POI search success rate",
  "Turn-by-turn engagement",
  "Rerouting frequency",
  "User-contributed edits",
];

const FAQS = [
  {
    q: "Can MapmyIndia or similar local players compete with Google Maps?",
    a: "In specific areas, yes. Hyperlocal Indian data (small lanes, indoor navigation, vernacular search, government-backed PIN code accuracy) is areas where MapmyIndia has an edge. Google Maps dominates globally through data scale and Android distribution. The niche plays exist; the horizontal play is Google&apos;s.",
  },
];

export default function PmMapsNavigationPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Maps & Navigation", url: `${SITE_URL}/pm-maps-navigation` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🗺️</span> Maps compound with data. Network effects win long-term.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Maps &amp; Navigation<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for maps and navigation PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Maps PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Maps PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
