import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Assistants (2026) — Designing Personal AI Assistants",
  description:
    "How PMs build AI assistants. Memory, personality, proactivity, and what makes an assistant feel like a real one.",
  keywords: [
    "PM AI assistant", "personal AI 2026",
  ],
  alternates: { canonical: "/pm-ai-assistants" },
  openGraph: {
    title: "PM AI Assistants 2026 — PM Streak",
    description: "Designing personal AI assistants.",
    url: `${SITE_URL}/pm-ai-assistants`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+AI+Assistants+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM AI Assistants 2026 — PM Streak",
    description: "Designing personal AI assistants.",
    images: [`${SITE_URL}/api/og?title=PM+AI+Assistants+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const QUALITIES = [
  "Memory across sessions — they remember you",
  "Personality consistent and appropriate for context",
  "Proactivity calibrated — useful, not annoying",
  "Trust signals when uncertain",
  "Graceful failure when out of scope",
];

const TRAPS = [
  "Trying to do everything — assistants that promise too much fail",
  "Personality that grates over weeks of use",
  "Memory that&apos;s creepy not helpful",
  "Proactivity that interrupts critical work",
];

const FAQS = [
  {
    q: "What separates an assistant from a chatbot?",
    a: "Persistence and proactivity. Chatbots respond when called. Assistants remember you across sessions and proactively help. The bar is high: most products that label themselves &apos;assistants&apos; are still chatbots dressed up. True assistants — like Apple Intelligence aspires to be — are still emerging in 2026.",
  },
];

export default function PmAiAssistantsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Assistants", url: `${SITE_URL}/pm-ai-assistants` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🤖</span> Most &apos;assistants&apos; are still chatbots dressed up
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Assistants<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 qualities and 4 traps for AI assistant PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI Assistant PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Qualities</h2>
          <div className="space-y-2">
            {QUALITIES.map((q, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{q}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Assistant Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
