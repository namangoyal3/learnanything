import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Deep Work for PMs (2026) — How to Protect Focus in a Meeting-Heavy Role | PM Streak",
  description:
    "How PMs protect deep work in a meeting-heavy role. Time-blocking, async defaults, focus rituals, and why PMs who protect deep work outperform those who stay reactive.",
  keywords: [
    "PM deep work", "focus time PM",
    "protect focus PM", "meeting-free time PM",
    "PM productivity deep work 2026",
  ],
  alternates: { canonical: "/pm-deep-work" },
  openGraph: {
    title: "Deep Work for PMs 2026 — PM Streak",
    description: "How PMs protect deep work in meeting-heavy roles — time-blocking, async defaults, focus rituals.",
    url: `${SITE_URL}/pm-deep-work`,
    type: "article",
  },
};

const TACTICS = [
  { tactic: "Block 2–3 hour focus sessions", why: "PM work needs context-loading. Short fragmented blocks produce shallow output." },
  { tactic: "Protect mornings when possible", why: "Cognitive energy is highest in the first 3 hours of your day. Don&apos;t spend it on Slack triage." },
  { tactic: "Batch meetings into 2 windows", why: "2 meeting blocks × 4 hours each = 16 hours of protected deep time per week vs scattered days." },
  { tactic: "Default to async", why: "Most &apos;quick calls&apos; don&apos;t need to be calls. Async first, sync only when async fails." },
  { tactic: "Turn off notifications during focus time", why: "Each notification costs ~20 min of context re-entry even if you don&apos;t respond." },
  { tactic: "Say no more often", why: "Every yes to a meeting is a no to deep work. Default no, say yes deliberately." },
];

const RITUALS = [
  "5-minute pre-work: write what you&apos;ll focus on, no phone, no Slack",
  "Start with the hardest task — cognitive energy depletes over the day",
  "Pomodoro-style timers (25 min focus, 5 min break) if you drift",
  "Close all irrelevant browser tabs — visual noise is cognitive noise",
  "Noise-cancelling headphones or lo-fi beats — signals to others you&apos;re heads-down",
  "Review what you shipped at the end — reinforces the reward of deep work",
];

const WHY_IT_MATTERS = [
  "PM work that produces compound returns (strategy docs, user research synthesis) requires deep focus",
  "Reactive PMs stay junior — they respond to tasks, never design strategy",
  "Deep work protects against burnout — fragmented attention feels busy but empty",
  "Hours of focused work produce artefacts; hours of meetings produce... more meetings",
  "The PMs with the strongest reputations usually produce 1–2 remarkable things per quarter — and protect time to do so",
];

const FAQS = [
  {
    q: "Isn&apos;t PM work inherently meeting-heavy?",
    a: "Yes — but much less than most PMs accept. The average PM attends 20+ hours of meetings weekly; the top 20% attend 10–12 by being deliberate. The difference: saying no to meetings without clear agendas, converting status updates to async, and blocking deep work time visibly on the calendar. Meeting load is largely a product of defaults, not necessity.",
  },
  {
    q: "How do PMs protect deep work when stakeholders expect immediate Slack responses?",
    a: "Set expectations once, explicitly. &apos;I&apos;m heads-down from 9–12 daily — I respond after lunch unless it&apos;s a P0.&apos; After 2 weeks, people adjust. The PMs who claim &apos;my team expects immediate responses&apos; usually haven&apos;t tested that assumption — most teams adjust quickly to calmer response patterns.",
  },
];

export default function PmDeepWorkPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Deep Work", url: `${SITE_URL}/pm-deep-work` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎯</span> The PMs who stand out are the ones who protected time to think
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Deep Work for PMs<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            6 tactics to protect focus, 6 deep work rituals, and why PMs who protect deep work
            produce more impact than those who stay reactive.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Focus Daily — Free →
          </Link>
        </section>

        {/* Why it matters */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">Why Deep Work Matters for PMs</h2>
          <div className="space-y-3">
            {WHY_IT_MATTERS.map((w, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{w}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tactics */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">6 Tactics to Protect Deep Work</h2>
            <div className="space-y-4">
              {TACTICS.map((t, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-5">
                  <p className="font-bold text-white mb-1">{i + 1}. {t.tactic}</p>
                  <p className="text-xs text-white/60">{t.why}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rituals */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 Deep Work Rituals</h2>
          <div className="space-y-2">
            {RITUALS.map((r, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
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
          <h2 className="text-2xl font-bold mb-3">Deep Work Compounds. Start Today.</h2>
          <p className="text-white/60 mb-6">Daily 2-minute PM scenarios — the easiest deep work ritual to start with.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
