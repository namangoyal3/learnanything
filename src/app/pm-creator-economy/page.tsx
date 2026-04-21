import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Creator Economy (2026) — How PMs Build Products for Creators | PM Streak",
  description:
    "How PMs build for the creator economy. Monetisation, creator tools, audience growth, and the tension between creators and platforms.",
  keywords: [
    "PM creator economy", "creator tools PM",
    "monetisation PM", "creator platform 2026",
  ],
  alternates: { canonical: "/pm-creator-economy" },
  openGraph: {
    title: "PM Creator Economy 2026 — PM Streak",
    description: "How PMs build products for creators — monetisation, tools, audience.",
    url: `${SITE_URL}/pm-creator-economy`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Creator+Economy+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Creator Economy 2026 — PM Streak",
    description: "How PMs build products for creators — monetisation, tools, audience.",
    images: [`${SITE_URL}/api/og?title=PM+Creator+Economy+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Power law distribution — top 1% of creators generate most of the value",
  "Multi-homing is default — creators publish on 3+ platforms simultaneously",
  "Platform risk is existential — algorithm change can kill a creator overnight",
  "Direct monetisation &gt; ads — subscriptions, tips, memberships outperform CPM",
  "Community is the moat — audiences move with the creator, not the platform",
];

const MONETISATION = [
  { m: "Subscriptions", w: "Predictable revenue; high ceiling but slow ramp." },
  { m: "Tips and donations", w: "Low friction, volatile. Works for live/interactive." },
  { m: "Paid courses/products", w: "Highest margin. Creator becomes entrepreneur." },
  { m: "Brand sponsorships", w: "Platform-agnostic. Marketplace opportunity for platforms to facilitate." },
  { m: "Ad revenue share", w: "Easy for platform, low for creator. Commodity pricing pressure." },
];

const FAQS = [
  {
    q: "What should creator platforms prioritise in 2026?",
    a: "Direct monetisation tools. Creators are exhausted by algorithm changes and want revenue they control. Platforms that enable subscriptions, paid products, and recurring relationships (not just ad revenue shares) will win creator loyalty. Substack, Patreon, and Kajabi got this right early.",
  },
];

export default function PmCreatorEconomyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Creator Economy", url: `${SITE_URL}/pm-creator-economy` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎨</span> Creators are a platform&apos;s suppliers — treat them like partners
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Creator Economy<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 monetisation models for creator platform PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Creator Platform PM Skills — Free →
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
            <h2 className="text-2xl font-bold text-center mb-10">5 Monetisation Models</h2>
            <div className="space-y-3">
              {MONETISATION.map((m, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                  <p className="font-semibold text-purple-400 text-sm mb-1">{m.m}</p>
                  <p className="text-xs text-white/60">{m.w}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Creator Economy PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
