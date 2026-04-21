import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Work-Life Balance (2026) — Actually Protecting Your Time as a PM | PM Streak",
  description:
    "How PMs actually protect time. Calendar hygiene, saying no, avoiding meeting sprawl, and why the myth of 10x output comes at a cost.",
  keywords: [
    "PM work life balance", "PM burnout 2026",
  ],
  alternates: { canonical: "/pm-work-life-balance" },
  openGraph: {
    title: "PM Work-Life Balance 2026 — PM Streak",
    description: "Protecting your time as a PM.",
    url: `${SITE_URL}/pm-work-life-balance`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Work-Life+Balance+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Work-Life Balance 2026 — PM Streak",
    description: "Protecting your time as a PM.",
    images: [`${SITE_URL}/api/og?title=PM+Work-Life+Balance+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const TACTICS = [
  "Block 2 hours of deep work daily — no meetings",
  "Decline meetings without agendas",
  "Batch 1:1s — one day, not scattered",
  "Async updates replace status meetings",
  "Schedule vacations in advance — they don&apos;t happen otherwise",
];

const MYTHS = [
  "Busy calendars signal productivity — usually the opposite",
  "Being reachable 24/7 helps your career — rarely true",
  "More meetings = more alignment — diminishing returns fast",
  "Saying no hurts your reputation — selective no builds it",
];

const FAQS = [
  {
    q: "Is PM burnout a real pattern or individual weakness?",
    a: "A real pattern. PMs sit at the intersection of many stakeholders and carry implicit responsibility for outcomes outside their direct control. Without deliberate boundary-setting, burnout is systemic. Orgs that treat balance as individual responsibility burn out more PMs; those that structure it into the job retain better.",
  },
];

export default function PmWorkLifeBalancePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Work-Life Balance", url: `${SITE_URL}/pm-work-life-balance` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🌿</span> Busy calendars usually signal poor prioritisation
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Work-Life Balance<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 tactics and 4 myths about PM balance.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Sustainable PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Tactics</h2>
          <div className="space-y-2">
            {TACTICS.map((t, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{t}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Myths</h2>
            <div className="space-y-2">
              {MYTHS.map((m, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
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
          <h2 className="text-2xl font-bold mb-3">Practice Sustainable PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
