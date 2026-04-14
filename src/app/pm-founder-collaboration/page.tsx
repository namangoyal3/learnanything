import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM + Founder Collaboration (2026) — Working Directly With the CEO | PM Streak",
  description:
    "How PMs at startups collaborate with founders. What works, what doesn&apos;t, and how to keep product decisions rigorous when the founder is the loudest voice in the room.",
  keywords: [
    "PM founder collaboration", "PM CEO collaboration",
    "startup PM role", "working with founder PM",
    "PM reporting to CEO 2026",
  ],
  alternates: { canonical: "/pm-founder-collaboration" },
  openGraph: {
    title: "PM + Founder Collaboration 2026 — PM Streak",
    description: "How PMs work with founders — keeping decisions rigorous when the founder is the loudest voice.",
    url: `${SITE_URL}/pm-founder-collaboration`,
    type: "article",
  },
};

const FOUNDER_DYNAMICS = [
  "Founders have more context than anyone on the problem domain — respect it",
  "Founders are usually the loudest voice in the room — but often not the most right",
  "Founders often have strong product instincts — which can be both gift and blindspot",
  "Founders change their mind frequently — ambiguity is part of the job",
  "Founders care about velocity — PMs who slow them down lose influence",
];

const WORKING_STYLE = [
  { move: "Become the filter, not the gatekeeper", detail: "Help founders decide faster, not decide for them" },
  { move: "Write weekly updates even when they don&apos;t ask", detail: "Founders are busy. Proactive updates build trust they can&apos;t explicitly request." },
  { move: "Bring 3 options, not 1 recommendation", detail: "Founders want to feel the trade-offs. Options let them own the call." },
  { move: "Use data to settle founder-vs-PM disagreements", detail: "&apos;Let&apos;s test it&apos; beats &apos;I think you&apos;re wrong&apos; — reality adjudicates" },
  { move: "Be honest about your confidence", detail: "&apos;I&apos;m 60% sure&apos; is more useful than &apos;this is definitely the right call.&apos;" },
  { move: "Ship fast, but with clear metrics", detail: "Founders love velocity. Pair it with &apos;we&apos;ll know in 2 weeks if this worked&apos;" },
];

const RED_FLAGS = [
  "Founder overrides your decisions without discussion — you&apos;re a scribe, not a PM",
  "Founder is the only user they design for — &apos;the founder likes it&apos; becomes the metric",
  "No documentation — everything lives in the founder&apos;s head",
  "Constant reversals on strategy — no bet survives a week",
  "Founder dismisses data that contradicts their instinct — bad sign for long-term product",
];

const FAQS = [
  {
    q: "Is startup PM role with direct founder access good for career growth?",
    a: "Excellent — if the founder respects PM work. You get massive scope, fast feedback, and exposure to strategic decisions. The trade-off: if the founder doesn&apos;t respect PM and overrides constantly, you&apos;re wasted. Before joining, ask the founder: &apos;What does a great PM look like to you?&apos; — their answer tells you everything.",
  },
  {
    q: "How do PMs handle founders who keep changing direction?",
    a: "Write it down. Every strategic decision gets a short doc. When the founder shifts, surface the prior decision: &apos;We decided X 6 weeks ago because Y. What&apos;s changed that makes us revisit?&apos; Sometimes the reasons are valid (new data). Sometimes it&apos;s whim. Documentation forces deliberate decision-making and protects the team from thrashing.",
  },
];

export default function PmFounderCollaborationPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM + Founder Collaboration", url: `${SITE_URL}/pm-founder-collaboration` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🚀</span> Working with founders is the fastest PM career accelerator — if done right
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM + Founder Collaboration<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 founder dynamics to understand, 6 moves that work, and 5 red flags
            that signal the startup PM role won&apos;t work out.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Collaboration Skills Daily — Free →
          </Link>
        </section>

        {/* Dynamics */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Founder Dynamics to Understand</h2>
          <div className="space-y-3">
            {FOUNDER_DYNAMICS.map((d, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Working style */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">6 Moves That Work</h2>
            <div className="space-y-4">
              {WORKING_STYLE.map((w, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-5">
                  <p className="font-bold text-white mb-1">{i + 1}. {w.move}</p>
                  <p className="text-xs text-white/60">{w.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Red flags */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Red Flags to Watch For</h2>
          <div className="space-y-2">
            {RED_FLAGS.map((r, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-red-400 flex-shrink-0">🚩</span>
                <p className="text-sm text-white/70">{r}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
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
          <h2 className="text-2xl font-bold mb-3">Train Startup PM Instincts Daily</h2>
          <p className="text-white/60 mb-6">Daily scenarios on fast decisions, ambiguity, and founder-mode PM work.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
