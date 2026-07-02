import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Building in Public (2026) — Why More PMs Should Share Their Work",
  description:
    "Why PMs benefit from building in public. Accountability, compounding distribution, and the specific things to share (and not).",
  keywords: [
    "PM build in public", "PM sharing work 2026",
  ],
  alternates: { canonical: "/pm-building-in-public" },
  openGraph: {
    title: "PM Building in Public 2026 — PM Streak",
    description: "Why more PMs should share their work.",
    url: `${SITE_URL}/pm-building-in-public`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Building+in+Public+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Building in Public 2026 — PM Streak",
    description: "Why more PMs should share their work.",
    images: [`${SITE_URL}/api/og?title=PM+Building+in+Public+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const BENEFITS = [
  "Accountability — public commitment drives consistency",
  "Distribution compounds — followers bring inbound opportunities",
  "Feedback from strangers surfaces blind spots",
  "Portfolio grows passively over years",
  "Mentorship happens in the open",
];

const WHAT_TO_SHARE = [
  "Learnings from specific projects — what surprised you",
  "Frameworks you&apos;ve found useful, with honest caveats",
  "Experiments that didn&apos;t work — rarer and more valuable",
  "Domain context as you learn it",
];

const FAQS = [
  {
    q: "What should PMs never share publicly?",
    a: "Confidential company metrics, pre-launch features, specific people&apos;s performance, internal drama, customer data. When in doubt, ask your manager. The safe rule: share lessons and principles, not specifics. Your observations generalise; your company&apos;s secrets don&apos;t.",
  },
];

export default function PmBuildingInPublicPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Building in Public", url: `${SITE_URL}/pm-building-in-public` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0e1113] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1f2228] border border-[#58cc02]/30 rounded-full px-4 py-1.5 text-sm text-[#89e219] mb-6">
            <span>📣</span> Share lessons and principles. Keep company specifics private.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Building in Public<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 benefits and 4 categories of what to share.
          </p>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#46a302] active:border-b-2 active:translate-y-[2px] text-white font-black px-8 py-3 rounded-2xl transition-all">
            Build Public PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Benefits</h2>
          <div className="space-y-2">
            {BENEFITS.map((b, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-[#89e219] font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#16181c] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 What-to-Shares</h2>
            <div className="space-y-2">
              {WHAT_TO_SHARE.map((w, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{w}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Building in Public Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
