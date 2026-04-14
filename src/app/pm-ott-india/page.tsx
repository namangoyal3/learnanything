import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM OTT India (2026) — JioCinema, Disney+ Hotstar, SonyLIV PM Guide | PM Streak",
  description:
    "How PMs build OTT products in India. Live sports, regional originals, mobile-first tiers, and the battle for prime time.",
  keywords: [
    "PM OTT india", "JioCinema PM",
    "Hotstar PM", "SonyLIV PM 2026",
  ],
  alternates: { canonical: "/pm-ott-india" },
  openGraph: {
    title: "PM OTT India 2026 — PM Streak",
    description: "How PMs build OTT products in India.",
    url: `${SITE_URL}/pm-ott-india`,
    type: "article",
  },
};

const DYNAMICS = [
  "Live sports drives DAU spikes — cricket peaks are massive, seasonal",
  "Regional language content unlocks Tier-2/3 scale",
  "Mobile-first tiers (single screen, SD) are default in India",
  "Ads beat subscription for scale — AVOD dominates, SVOD follows",
  "Telco bundles are distribution moats — Jio, Airtel, Vi partnerships matter",
];

const METRICS = [
  "Watch time per DAU and concurrent peak viewers",
  "Live event churn — D+1 after an event",
  "Ad completion rate and CPM",
  "Subscription conversion in key content windows",
  "Regional content engagement share",
];

const FAQS = [
  {
    q: "Why does cricket define Indian OTT?",
    a: "Because it&apos;s the only content that reliably drives 20–50M concurrent viewers. IPL, World Cup, and bilateral cricket series are category-shaping events. The platform that holds the rights wins the season; the platforms that don&apos;t spend the season defending retention. It&apos;s also why Jio acquired IPL digital rights — the content is the strategy.",
  },
];

export default function PmOttIndiaPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM OTT India", url: `${SITE_URL}/pm-ott-india` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🏏</span> Cricket defines Indian OTT. Everything else is support.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM OTT India<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for Indian OTT PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build OTT PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice OTT PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
