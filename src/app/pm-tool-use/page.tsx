import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Tool Use (2026) — Designing Agents That Use APIs Reliably | PM Streak",
  description:
    "How PMs design tool-using agents. Tool selection, error handling, and why tool-use reliability is the bottleneck for agentic products.",
  keywords: [
    "PM AI tool use", "agent tool use 2026",
  ],
  alternates: { canonical: "/pm-tool-use" },
  openGraph: {
    title: "PM AI Tool Use 2026 — PM Streak",
    description: "Designing agents that use APIs reliably.",
    url: `${SITE_URL}/pm-tool-use`,
    type: "article",
  },
};

const PRINCIPLES = [
  "Tool descriptions are the prompt — invest in clarity",
  "Few well-chosen tools beat dozens",
  "Validate inputs before tool execution",
  "Handle tool failures gracefully — most tools fail occasionally",
  "Log every tool call for debugging and eval",
];

const TRAPS = [
  "Too many tools — model confusion increases linearly",
  "Vague tool descriptions — model picks wrong tool",
  "No retry / fallback when tool fails",
  "Ignoring cost and latency of tool calls",
];

const FAQS = [
  {
    q: "Why is tool-use reliability the bottleneck for agents?",
    a: "Because compounded error rates kill agent loops. If each tool call has a 95% success rate and an agent makes 10 calls, end-to-end success is ~60%. The math gets brutal fast. Agents that work in production minimise tool calls, validate inputs, and retry intelligently — not just &apos;hope the model does the right thing.&apos;",
  },
];

export default function PmToolUsePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Tool Use", url: `${SITE_URL}/pm-tool-use` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🔧</span> Tool-use reliability compounds. So do failures.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Tool Use<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 principles and 4 traps for PMs designing tool-using agents.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Tool-Use PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Principles</h2>
          <div className="space-y-2">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{p}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Tool-Use PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
