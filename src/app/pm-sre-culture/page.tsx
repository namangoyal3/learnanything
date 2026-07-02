import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM SRE Culture (2026) — Error Budgets, SLOs, and PM Responsibility for Reliability",
  description:
    "How PMs work with SRE teams. Error budgets, SLOs, postmortems, and why PMs own the tradeoff between velocity and reliability.",
  keywords: [
    "PM SRE", "error budget",
    "SLO PM 2026",
  ],
  alternates: { canonical: "/pm-sre-culture" },
  openGraph: {
    title: "PM SRE Culture 2026 — PM Streak",
    description: "How PMs work with SRE teams.",
    url: `${SITE_URL}/pm-sre-culture`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+SRE+Culture+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM SRE Culture 2026 — PM Streak",
    description: "How PMs work with SRE teams.",
    images: [`${SITE_URL}/api/og?title=PM+SRE+Culture+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const CONCEPTS = [
  "SLO — service level objective. What reliability do we promise?",
  "Error budget — allowed unreliability over a window",
  "SLI — service level indicator, actual measurement",
  "Blameless postmortems — learning &gt; blaming",
  "Chaos engineering — proactively break things to learn",
];

const PM_ROLES = [
  "Negotiate SLOs with eng and business",
  "Decide whether to spend error budget on features or reliability",
  "Prioritise reliability work alongside feature work",
  "Drive postmortem action items to completion",
  "Communicate reliability tradeoffs to stakeholders",
];

const FAQS = [
  {
    q: "Should PMs care about SLOs?",
    a: "Yes — deeply. Every feature ships at the cost of some error budget. PMs who don&apos;t engage with this tradeoff ship features that break production and get reversed. PMs who own it ship more reliably. The SLO conversation is fundamentally a product prioritisation conversation in disguise.",
  },
];

export default function PmSreCulturePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM SRE Culture", url: `${SITE_URL}/pm-sre-culture` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🛠️</span> SLO conversations are product prioritisation in disguise
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM SRE Culture<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 SRE concepts and 5 PM responsibilities in reliability culture.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build SRE PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Concepts</h2>
          <div className="space-y-2">
            {CONCEPTS.map((c, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{c}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 PM Roles</h2>
            <div className="space-y-2">
              {PM_ROLES.map((p, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{p}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice SRE PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
