import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Conviction &amp; Pushback (2026) — How to Hold Your Ground Without Losing Relationships",
  description:
    "How PMs push back on leadership, customers, or peers without damaging trust. Disagree-and-commit, when to hold, when to fold, and how to signal conviction calmly.",
  keywords: [
    "PM pushback", "disagree and commit PM",
    "PM conviction", "how PM pushes back",
    "PM managing up 2026",
  ],
  alternates: { canonical: "/pm-conviction-pushback" },
  openGraph: {
    title: "PM Conviction &amp; Pushback 2026 — PM Streak",
    description: "How PMs push back effectively — holding ground without losing relationships.",
    url: `${SITE_URL}/pm-conviction-pushback`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Conviction+&amp;+Pushback+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Conviction &amp; Pushback 2026 — PM Streak",
    description: "How PMs push back effectively — holding ground without losing relationships.",
    images: [`${SITE_URL}/api/og?title=PM+Conviction+&amp;+Pushback+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const WHEN_TO_PUSH = [
  "The decision is likely wrong on user outcomes — not just inconvenient",
  "You have concrete evidence (data, user quotes) — not just instinct",
  "The decision is reversible later — so pushing back now doesn&apos;t block progress",
  "The stakes are high enough to justify the relationship cost",
  "You have credibility you can spend on this topic",
];

const WHEN_TO_FOLD = [
  "Your pushback is based on preference, not evidence",
  "The decision is reversible and will fail quickly if wrong — let reality teach",
  "You&apos;ve pushed back twice already — a third time erodes relationships",
  "You&apos;re missing context the decision-maker has",
  "It&apos;s not your call to make — respect the chain",
];

const HOW_TO_PUSH = [
  "Start by acknowledging the other side&apos;s case — &apos;I see why X makes sense because Y&apos;",
  "Lead with data/examples — not &apos;I feel&apos; or &apos;I think we should&apos;",
  "Offer alternatives, not just objections — &apos;Instead of A, what about B?&apos;",
  "Put your confidence on the record — &apos;I&apos;m 70% confident this is wrong&apos;",
  "Commit after the decision — disagree and commit is a real discipline",
  "Document the disagreement — if it turns out you were right, you can surface the lesson",
];

const SIGNALING_CONVICTION = [
  "Clear, calm voice — shouting signals insecurity, not conviction",
  "Short sentences — long paragraphs signal you&apos;re hedging",
  "Specific asks — &apos;I need 1 week to validate&apos; beats &apos;I need more time&apos;",
  "Name the stake — &apos;If we ship this way, we risk X&apos; beats &apos;I&apos;m worried&apos;",
  "Be willing to lose — conviction without willingness to be wrong reads as stubbornness",
];

const FAQS = [
  {
    q: "How much should PMs push back against their manager?",
    a: "Enough to do your job, not enough to damage the relationship. A useful heuristic: push hard on 1–2 things per quarter where you have strong conviction and evidence. On everything else, trust your manager&apos;s judgment. PMs who push back on everything lose trust; PMs who never push back look like executors, not thinkers. Calibrated pushback is a senior-PM signal.",
  },
  {
    q: "What&apos;s the difference between conviction and stubbornness?",
    a: "Conviction is backed by evidence and open to being wrong. Stubbornness is backed by ego and closed to being wrong. The test: when new evidence arrives, does your position update? If yes, you have conviction. If no, you have stubbornness. Leaders respect conviction; they disengage from stubbornness.",
  },
];

export default function PmConvictionPushbackPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Conviction &amp; Pushback", url: `${SITE_URL}/pm-conviction-pushback` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎯</span> Hold the line when it matters. Commit when it&apos;s decided.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Conviction &amp; Pushback<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            When to push back vs fold, how to push without damaging trust,
            and how to signal conviction calmly instead of aggressively.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Practice Hard Conversations Daily — Free →
          </Link>
        </section>

        {/* When to push */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Reasons to Push Back</h2>
          <div className="space-y-2">
            {WHEN_TO_PUSH.map((w, i) => (
              <div key={i} className="bg-[#111] border border-green-500/20 rounded-xl p-3 flex gap-3">
                <span className="text-green-400 font-bold flex-shrink-0">✓</span>
                <p className="text-sm text-white/70">{w}</p>
              </div>
            ))}
          </div>
        </section>

        {/* When to fold */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Reasons to Fold Gracefully</h2>
            <div className="space-y-2">
              {WHEN_TO_FOLD.map((w, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{w}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 Moves for Effective Pushback</h2>
          <div className="space-y-2">
            {HOW_TO_PUSH.map((h, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{h}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Signalling */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Ways to Signal Conviction Calmly</h2>
            <div className="space-y-2">
              {SIGNALING_CONVICTION.map((s, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{s}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Hard Conversations Daily</h2>
          <p className="text-white/60 mb-6">Daily scenarios on tough pushback, stakeholder disagreements, and managing up.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
