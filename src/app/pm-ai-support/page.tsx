import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Customer Support (2026) — Decagon, Ada, Fin AI PM Lessons | PM Streak",
  description:
    "How PMs build AI customer support. Deflection, knowledge base quality, human handoff, and the evolution from chatbots to true support agents.",
  keywords: [
    "PM AI support", "Decagon PM",
    "Ada PM", "Fin AI 2026",
  ],
  alternates: { canonical: "/pm-ai-support" },
  openGraph: {
    title: "PM AI Customer Support 2026 — PM Streak",
    description: "How PMs build AI customer support.",
    url: `${SITE_URL}/pm-ai-support`,
    type: "article",
  },
};

const DYNAMICS = [
  "Knowledge base quality is the product — garbage in, garbage out",
  "Deflection rate is the dominant sales metric — 60%+ is the new benchmark",
  "Tone and persona match brand — not everyone wants perky",
  "Human handoff must be seamless — context lost = support nightmare",
  "Analytics on unresolved queries drives knowledge base growth",
];

const METRICS = [
  "AI deflection rate",
  "Customer satisfaction (CSAT) on AI-handled tickets",
  "Escalation-to-human rate by category",
  "First-response time",
  "Resolution time compared to human baseline",
];

const FAQS = [
  {
    q: "Is AI customer support a real category in 2026?",
    a: "Yes, and scaling fast. Decagon, Ada, Fin (Intercom), and Sierra have material ARR. Enterprise buyers now expect 40–60% deflection, not &apos;can we try a chatbot?&apos;. The shift from rule-based bots to LLM-powered agents is largely complete in 2026.",
  },
];

export default function PmAiSupportPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Customer Support", url: `${SITE_URL}/pm-ai-support` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎧</span> Knowledge base quality is the real AI support product
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Customer Support<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for AI customer support PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI Support PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Support PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
