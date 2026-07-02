import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Loyalty Programs (2026) — Designing Rewards That Change Behaviour",
  description:
    "How PMs design loyalty programs. Points vs tiers, breakage, behavioural economics, and why most loyalty programs just subsidise loyal users.",
  keywords: [
    "PM loyalty programs", "rewards PM",
    "loyalty design 2026",
  ],
  alternates: { canonical: "/pm-loyalty-programs" },
  openGraph: {
    title: "PM Loyalty Programs 2026 — PM Streak",
    description: "Designing rewards that change behaviour.",
    url: `${SITE_URL}/pm-loyalty-programs`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Loyalty+Programs+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Loyalty Programs 2026 — PM Streak",
    description: "Designing rewards that change behaviour.",
    images: [`${SITE_URL}/api/og?title=PM+Loyalty+Programs+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const MODELS = [
  { m: "Points", w: "Simple, flexible, easy to dilute over time" },
  { m: "Tiered status", w: "Creates aspirational engagement (Silver/Gold/Platinum)" },
  { m: "Cashback", w: "Transparent value, minimal engagement mechanic" },
  { m: "Membership (Prime-style)", w: "Paid upfront; changes buying behaviour radically" },
  { m: "Experiential", w: "Access, exclusivity, concerts — high perceived value, low cost" },
];

const TRAPS = [
  "Rewarding the already-loyal — loyalty program becomes a margin leak",
  "Too-easy earn, too-hard redeem — breakage masks user frustration",
  "Copy-paste tiers — same Gold/Platinum names, no differentiation",
  "No tie to incremental behaviour — you pay for what users would do anyway",
];

const FAQS = [
  {
    q: "Why do most loyalty programs fail to drive incremental behaviour?",
    a: "Because they reward existing behaviour rather than changing it. A 2% cashback on spend you&apos;d make anyway isn&apos;t loyalty — it&apos;s a margin donation. The best programs tie rewards to new behaviours (first purchase in new category, referral, review) that wouldn&apos;t happen otherwise.",
  },
];

export default function PmLoyaltyProgramsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Loyalty Programs", url: `${SITE_URL}/pm-loyalty-programs` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🏅</span> Good loyalty changes behaviour. Bad loyalty subsidises it.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Loyalty Programs<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 loyalty models and 4 traps to avoid.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Loyalty PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Models</h2>
          <div className="space-y-3">
            {MODELS.map((m, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                <p className="font-semibold text-purple-400 text-sm mb-1">{m.m}</p>
                <p className="text-xs text-white/60">{m.w}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Traps</h2>
            <div className="space-y-2">
              {TRAPS.map((t, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{t}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Loyalty PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
