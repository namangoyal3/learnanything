import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Voice Products (2026) — Designing for Voice Interfaces | PM Streak",
  description:
    "How PMs design voice products. Conversation design, intent detection, latency budgets, and why voice is harder than it looks.",
  keywords: [
    "PM voice products", "voice UX PM",
    "conversation design", "voice interface 2026",
  ],
  alternates: { canonical: "/pm-voice-products" },
  openGraph: {
    title: "PM Voice Products 2026 — PM Streak",
    description: "How PMs design voice products — conversation, intent, latency.",
    url: `${SITE_URL}/pm-voice-products`,
    type: "article",
  },
};

const PRINCIPLES = [
  "Latency is UX — anything over 300ms feels broken in conversation",
  "Error recovery is the product — most users hit errors; design for graceful recovery",
  "Context persists — users expect the agent to remember within a session",
  "Voice ≠ text — shorter responses, explicit confirmations, no markdown",
  "Multimodal when possible — pair voice with screen for complex tasks",
];

const METRICS = [
  "Task completion rate — did the user finish what they wanted?",
  "Median turn latency — p95 matters more",
  "Intent recognition accuracy — how often does it misunderstand?",
  "Repair rate — how often does the user have to rephrase?",
  "Session length vs satisfaction — long sessions are not always good",
];

const FAQS = [
  {
    q: "Is voice finally a real product category in 2026?",
    a: "For specific use cases, yes — customer support, in-car, accessibility, hands-busy contexts (cooking, driving, IoT). As a general-purpose interface replacing screens, still no. Voice wins when screens fail, not as a default. Best voice PMs know which category they&apos;re in.",
  },
];

export default function PmVoiceProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Voice Products", url: `${SITE_URL}/pm-voice-products` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎙️</span> Voice wins where screens fail — not everywhere
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Voice Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 design principles and 5 metrics for voice product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Voice PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Voice PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
