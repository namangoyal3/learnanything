import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Discovery Process (2026) — Continuous Discovery for Product Managers | PM Streak",
  description:
    "How PMs run continuous discovery. Interviews, opportunity trees, assumption testing — Teresa Torres&apos; framework applied.",
  keywords: [
    "PM discovery", "continuous discovery",
    "opportunity solution tree", "discovery 2026",
  ],
  alternates: { canonical: "/pm-discovery-process" },
  openGraph: {
    title: "PM Discovery Process 2026 — PM Streak",
    description: "Continuous discovery for product managers.",
    url: `${SITE_URL}/pm-discovery-process`,
    type: "article",
  },
};

const RITUALS = [
  "Weekly user interview — minimum cadence for discovery muscle",
  "Opportunity solution tree — visualise outcome → opportunities → solutions",
  "Assumption tests before build — cheaper to falsify assumptions than to undo bad builds",
  "Story mapping — connect solutions to user journey, find gaps",
  "Discovery retro — every 6 weeks: what did we learn? What changed?",
];

const OUTCOMES = [
  "Clearer opportunity backlog — not feature backlog",
  "Lower rate of shipping wrong things",
  "Faster kill decisions — bad bets die in discovery, not in production",
  "Better roadmap defensibility — decisions backed by evidence",
];

const FAQS = [
  {
    q: "How do PMs find time for discovery when shipping pressure is constant?",
    a: "Protect a recurring slot. 2 hours per week is the minimum — 1 hour interview + 1 hour synthesis. PMs who don&apos;t make this time ship more features and learn less. Over a year, the discovery-light PM looks busier; the discovery-disciplined PM ships things that actually work.",
  },
];

export default function PmDiscoveryProcessPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Discovery Process", url: `${SITE_URL}/pm-discovery-process` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🔍</span> Discovery is not a phase — it&apos;s a weekly habit
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Discovery Process<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 discovery rituals and 4 outcomes of doing it well.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Discovery PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Discovery Rituals</h2>
          <div className="space-y-2">
            {RITUALS.map((r, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{r}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Outcomes</h2>
            <div className="space-y-2">
              {OUTCOMES.map((o, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{o}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Discovery Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
