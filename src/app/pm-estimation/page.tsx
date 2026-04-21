import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Estimation (2026) — How PMs Estimate Work Honestly | PM Streak",
  description:
    "How PMs estimate timelines without lying to themselves. Reference-class forecasting, buffers, and why single-point estimates fail.",
  keywords: [
    "PM estimation", "software estimation",
    "reference class forecasting PM 2026",
  ],
  alternates: { canonical: "/pm-estimation" },
  openGraph: {
    title: "PM Estimation 2026 — PM Streak",
    description: "How PMs estimate work honestly.",
    url: `${SITE_URL}/pm-estimation`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Estimation+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Estimation 2026 — PM Streak",
    description: "How PMs estimate work honestly.",
    images: [`${SITE_URL}/api/og?title=PM+Estimation+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const PRACTICES = [
  "Estimate ranges, not points — &apos;2–4 weeks&apos; beats &apos;3 weeks&apos;",
  "Reference-class forecasting — compare to similar past projects, not your optimism",
  "Separate unknowns from knowns — list open questions before estimating",
  "Buffer 30–50% for integration and review — not for slack",
  "Re-estimate after every sprint — the first estimate is always wrong",
];

const BIASES = [
  "Planning fallacy — we underestimate our own tasks by 30–50% consistently",
  "Sunk-cost — already invested time inflates willingness to continue",
  "Optimism bias — engineers and PMs both suffer, just in different ways",
  "Scope creep — small additions silently extend timelines",
];

const FAQS = [
  {
    q: "Why do engineering estimates slip so often?",
    a: "Partly because we ignore integration, review, edge cases, and unknowns. Partly because the environment rewards optimistic estimates over realistic ones. The fix is systemic: reference-class forecasting, honest buffers, and rewarding truth-telling over short-term promises. Over a year, teams that estimate honestly ship more, not less.",
  },
];

export default function PmEstimationPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Estimation", url: `${SITE_URL}/pm-estimation` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>⏱️</span> Honest estimates ship more over time than optimistic ones
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Estimation<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 estimation practices and 4 biases to catch yourself on.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Estimation PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Practices</h2>
          <div className="space-y-2">
            {PRACTICES.map((p, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Biases</h2>
            <div className="space-y-2">
              {BIASES.map((b, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{b}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Estimation Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
