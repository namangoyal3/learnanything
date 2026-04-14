import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "10 PM Habits That Compound (2026) — Small Daily Practices of Great Product Managers | PM Streak",
  description:
    "10 daily, weekly, and monthly habits of great PMs. Small practices that compound into mastery over years. The habits that separate top PMs from average ones.",
  keywords: [
    "PM habits", "great product manager habits",
    "daily PM practices", "what top PMs do",
    "PM career habits 2026",
  ],
  alternates: { canonical: "/pm-habits" },
  openGraph: {
    title: "10 PM Habits That Compound 2026 — PM Streak",
    description: "The daily, weekly, and monthly practices that compound into PM mastery.",
    url: `${SITE_URL}/pm-habits`,
    type: "article",
  },
};

const HABITS = [
  {
    habit: "Talk to 1 user per week",
    cadence: "Weekly",
    why: "Direct user exposure builds instinct that data alone can&apos;t replicate. Compounds fastest of any PM habit.",
  },
  {
    habit: "Read 10 support tickets per week",
    cadence: "Weekly",
    why: "Raw user pain surfaces in support tickets. PMs who stay close to this stay close to reality.",
  },
  {
    habit: "Check your north star daily (30 seconds)",
    cadence: "Daily",
    why: "You catch weird movements early. Teams who glance at the metric daily react faster than teams who review weekly.",
  },
  {
    habit: "Write 1 long-form post per quarter",
    cadence: "Quarterly",
    why: "Writing clarifies thinking. Public writing attracts a network and forces you to develop opinions.",
  },
  {
    habit: "Teardown 1 product per week (30 min)",
    cadence: "Weekly",
    why: "Pattern library grows. In 2 years, you&apos;ll recognise UX decisions faster than peers who don&apos;t do this.",
  },
  {
    habit: "Weekly review (20 min)",
    cadence: "Weekly",
    why: "Structured reflection compounds. 17 hours/year of career thinking is a massive delta over PMs who don&apos;t do this.",
  },
  {
    habit: "Monthly 1:1 with your manager&apos;s manager",
    cadence: "Monthly",
    why: "Skip-level visibility shapes career trajectory. Don&apos;t wait to be invited — ask for it." ,
  },
  {
    habit: "Kill one meeting per month",
    cadence: "Monthly",
    why: "Meeting overload creeps. Active pruning keeps your calendar aligned with your priorities." ,
  },
  {
    habit: "Quarterly skill audit",
    cadence: "Quarterly",
    why: "Your skills decay if not deliberately grown. Pick one to improve per quarter." ,
  },
  {
    habit: "Annual career conversation with 3 mentors",
    cadence: "Annual",
    why: "External perspective catches blind spots. 3 mentors triangulate better than any single one." ,
  },
];

const COMPOUND_MATH = [
  "Talk to 1 user/week = 50 users/year = 500 users over a 10-year PM career",
  "Teardown 1 product/week = 50 teardowns/year = unmatched product sense",
  "20 min weekly review = 17 hours/year of structured career thinking",
  "1 long-form post/quarter = 40 posts over 10 years = reputation + network",
  "Monthly skip-level = 12 extra visibility touchpoints/year",
];

const FAQS = [
  {
    q: "What&apos;s the single most impactful PM habit?",
    a: "Talking to users directly, weekly. Every successful PM I know agrees on this, even though they&apos;d disagree on almost everything else. Direct user exposure is the one habit that builds PM intuition faster than anything else. Analytics, meetings, frameworks, and reading are all valuable — but they don&apos;t replace the weekly compounding signal of watching real users struggle with your product.",
  },
  {
    q: "How should PMs start building these habits?",
    a: "Pick 1 habit. Do it consistently for 8 weeks. Add the second only when the first is automatic. Trying to add all 10 at once fails. The compound returns come from consistency, and consistency comes from small starts. The PMs with the strongest habits today started with one small thing 5 years ago.",
  },
];

export default function PmHabitsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Habits", url: `${SITE_URL}/pm-habits` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🔁</span> Small daily practices. Massive 5-year delta.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            10 PM Habits That Compound<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            The 10 habits that separate great PMs from average ones. Small, consistent,
            and calibrated to compound over a multi-year career.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Make Daily Practice a Habit — Free →
          </Link>
        </section>

        {/* Habits */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="space-y-4">
            {HABITS.map((h, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <p className="font-bold text-white">{i + 1}. {h.habit}</p>
                  <span className="text-xs bg-[#7c3aed]/20 text-purple-400 px-2 py-0.5 rounded-full">{h.cadence}</span>
                </div>
                <p className="text-xs text-white/60">{h.why}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compound math */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">The Math of Compounding</h2>
            <div className="space-y-3">
              {COMPOUND_MATH.map((c, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4 flex gap-3">
                  <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{c}</p>
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
          <h2 className="text-2xl font-bold mb-3">Make &quot;Practice PM Daily&quot; Your First Habit</h2>
          <p className="text-white/60 mb-6">2 minutes a day on PM scenarios is the easiest compounding habit to start.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
