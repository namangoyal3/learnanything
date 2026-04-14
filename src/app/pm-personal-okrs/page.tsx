import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Personal OKRs (2026) — Setting Career Goals That Compound | PM Streak",
  description:
    "How PMs set personal OKRs for career growth. Skill, network, brand, and impact — and why writing them down dramatically increases follow-through.",
  keywords: [
    "PM personal OKRs", "PM career goals 2026",
  ],
  alternates: { canonical: "/pm-personal-okrs" },
  openGraph: {
    title: "PM Personal OKRs 2026 — PM Streak",
    description: "Setting career goals that compound.",
    url: `${SITE_URL}/pm-personal-okrs`,
    type: "article",
  },
};

const CATEGORIES = [
  "Skills — what specific PM skill am I leveling this quarter?",
  "Network — who am I deliberately building relationships with?",
  "Brand — what artifacts am I publishing?",
  "Impact — what specific outcomes did I drive?",
  "Health and balance — non-work goals that sustain career",
];

const RULES = [
  "3 OKRs per quarter, max — not 10",
  "Write them down where you&apos;ll see them weekly",
  "Review honestly mid-quarter; adjust if needed",
  "Share with a trusted peer for accountability",
  "Celebrate hitting them; learn from missing them",
];

const FAQS = [
  {
    q: "Do personal OKRs actually change behaviour?",
    a: "Only if you write them down and review them. Mental goals evaporate within weeks. Written goals you revisit weekly survive months. The PMs who deliberately set and track personal OKRs progress 2x faster than those who don&apos;t. The mechanism is simple: visible commitments compete for your time more effectively.",
  },
];

export default function PmPersonalOkrsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Personal OKRs", url: `${SITE_URL}/pm-personal-okrs` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎯</span> Mental goals evaporate. Written ones compound.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Personal OKRs<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 OKR categories and 5 rules for personal goal-setting.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Goal Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Categories</h2>
          <div className="space-y-2">
            {CATEGORIES.map((c, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{c}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Rules</h2>
            <div className="space-y-2">
              {RULES.map((r, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{r}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Personal OKR Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
