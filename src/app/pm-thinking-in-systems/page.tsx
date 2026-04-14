import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Thinking in Systems (2026) — Why Senior PMs Think in Loops, Not Lists | PM Streak",
  description:
    "How senior PMs apply systems thinking. Stocks, flows, feedback loops, and unintended consequences — the mindset shift that separates senior from staff PM.",
  keywords: [
    "PM systems thinking", "feedback loops PM 2026",
  ],
  alternates: { canonical: "/pm-thinking-in-systems" },
  openGraph: {
    title: "PM Thinking in Systems 2026 — PM Streak",
    description: "Why senior PMs think in loops, not lists.",
    url: `${SITE_URL}/pm-thinking-in-systems`,
    type: "article",
  },
};

const CONCEPTS = [
  "Stocks and flows — what accumulates over time and at what rate",
  "Reinforcing loops — small change, exponential effect",
  "Balancing loops — system pushes back against change",
  "Delays — time between action and effect distorts learning",
  "Unintended consequences — every solution creates new problems",
];

const APPLICATIONS = [
  "Growth loops vs growth funnels",
  "Habit formation in user behaviour",
  "Network effects and tipping points",
  "Org dynamics — why processes drift over time",
];

const FAQS = [
  {
    q: "Where do PMs go wrong with systems thinking?",
    a: "By over-applying it. Systems thinking helps for strategic decisions and complex feedback loops. It&apos;s overkill for day-to-day PM work. Use it when the problem has loops you don&apos;t see; skip it when the problem is linear and well-bounded.",
  },
];

export default function PmThinkingInSystemsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Thinking in Systems", url: `${SITE_URL}/pm-thinking-in-systems` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>♾️</span> Senior PMs see the loop, not just the next step
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Thinking in Systems<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 systems-thinking concepts and 4 applications for PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Systems PM Skills — Free →
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
            <h2 className="text-2xl font-bold text-center mb-10">4 Applications</h2>
            <div className="space-y-2">
              {APPLICATIONS.map((a, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{a}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Systems PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
