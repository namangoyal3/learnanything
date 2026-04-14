import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM No-Code & Low-Code (2026) — Building Products for Non-Developers | PM Streak",
  description:
    "How PMs build no-code and low-code products. Webflow, Bubble, Retool, Glide — abstractions, escape hatches, and audience design.",
  keywords: [
    "PM no-code", "low-code PM",
    "no-code product 2026",
  ],
  alternates: { canonical: "/pm-no-code" },
  openGraph: {
    title: "PM No-Code & Low-Code 2026 — PM Streak",
    description: "How PMs build no-code and low-code products.",
    url: `${SITE_URL}/pm-no-code`,
    type: "article",
  },
};

const TRADEOFFS = [
  "Power vs simplicity — more features, more UI, more overwhelm",
  "Abstraction vs escape hatches — no-code always needs a way out for power users",
  "Audience drift — tools expand from non-devs to devs; pricing and UX must keep up",
  "Template marketplace — leverage for acquisition, but quality control matters",
  "AI integration — natural language is rewriting the no-code interface",
];

const METRICS = [
  "Time-to-first-published-app",
  "Retention by user type (hobbyist, business, agency)",
  "Template usage vs blank-canvas usage",
  "Export / code-out rate — signal of audience outgrowth",
  "Paid plan conversion and tier distribution",
];

const FAQS = [
  {
    q: "Will AI kill no-code?",
    a: "No — but it will change who uses it. AI lowers the floor for non-devs to build basic apps; no-code platforms will continue winning on structure, governance, and collaboration. The dangerous middle (visual builders with no AI) is where competitive pressure is highest. The platforms that succeed combine no-code primitives with AI scaffolding.",
  },
];

export default function PmNoCodePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM No-Code & Low-Code", url: `${SITE_URL}/pm-no-code` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🧩</span> No-code PMs design abstractions — and escape hatches
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM No-Code &amp; Low-Code<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 tradeoffs and 5 metrics for no-code product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build No-Code PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Tradeoffs</h2>
          <div className="space-y-2">
            {TRADEOFFS.map((t, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{t}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice No-Code PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
