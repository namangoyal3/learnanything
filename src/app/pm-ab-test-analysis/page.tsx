import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM A/B Test Analysis (2026) — How to Read Results Like a Pro",
  description:
    "How PMs analyse A/B test results correctly. Statistical significance, effect size, segmentation, and the biases that lead to bad decisions.",
  keywords: [
    "PM A/B test analysis", "reading A/B test results",
    "statistical significance PM", "p-value PM",
    "A/B test segmentation 2026",
  ],
  alternates: { canonical: "/pm-ab-test-analysis" },
  openGraph: {
    title: "PM A/B Test Analysis 2026 — PM Streak",
    description: "How PMs read A/B test results correctly — significance, effect size, segmentation.",
    url: `${SITE_URL}/pm-ab-test-analysis`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+A+B+Test+Analysis+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM A/B Test Analysis 2026 — PM Streak",
    description: "How PMs read A/B test results correctly — significance, effect size, segmentation.",
    images: [`${SITE_URL}/api/og?title=PM+A+B+Test+Analysis+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const READING_CHECKLIST = [
  "Did we reach pre-committed sample size? If not, it&apos;s not done yet.",
  "Is the effect statistically significant? (p-value &lt; 0.05)",
  "Is the effect size meaningful? (Practical significance, not just statistical)",
  "Did guardrail metrics stay healthy? Winning primary + broken guardrail = net loss.",
  "Does the effect hold across segments? If only 1 segment drives it, that&apos;s important context.",
  "Are there novelty effects that might fade? (Run 2 weekly cycles to confirm)",
  "Is the AA check clean? (A/A test during the run should show no difference)",
];

const SEGMENTATION_WINS = [
  "New vs existing users — often move opposite directions",
  "Mobile vs web — mobile-first products ship differently to each",
  "Geographic — Tier-1 vs Tier-2/3 may behave differently",
  "Acquisition channel — organic vs paid users have different baselines",
  "Cohort (signup date) — recent cohorts can differ from old ones",
];

const COMMON_BIASES = [
  "Peeking early and stopping when you see significance — p-hacking",
  "Running multiple tests, picking the one that &apos;won&apos; — multiple-comparison problem",
  "Attributing lift to the feature when seasonality explains it — correlation vs causation",
  "Ignoring guardrails that moved — primary won, but at what cost?",
  "Reading a flat test as &apos;no effect&apos; vs &apos;effect too small to detect&apos; — different conclusions",
  "Using the test as confirmation of your hypothesis rather than a test of it",
];

const DECISION_RULES = [
  "Primary wins significantly + guardrails healthy → ship",
  "Primary flat + guardrails healthy → don&apos;t ship, but learnings are valuable",
  "Primary wins but a guardrail breaks → don&apos;t ship, investigate trade-off",
  "Primary wins in 1 segment only → ship to that segment if big enough; don&apos;t generalise",
  "Result is inconclusive (underpowered) → decide: extend the test, run at higher N, or call based on judgment",
];

const FAQS = [
  {
    q: "What p-value should PMs use for A/B tests?",
    a: "0.05 is the industry default. For high-stakes tests (major redesigns, monetisation changes), use 0.01 — you want higher certainty before shipping. For quick iteration on low-risk features, 0.1 is sometimes acceptable. The trade-off: tighter p-value = more certainty but longer runs.",
  },
  {
    q: "How long should A/B tests run?",
    a: "Pre-determined by your sample size calculation. For most consumer products, 7–14 days is typical (covers weekday/weekend patterns). Shorter tests miss cyclical effects; longer tests delay decisions unnecessarily. The cardinal sin: extending tests mid-run to &apos;wait for significance&apos; — that&apos;s p-hacking, not patience.",
  },
];

export default function PmAbTestAnalysisPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM A/B Test Analysis", url: `${SITE_URL}/pm-ab-test-analysis` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📊</span> Reading A/B tests well is 50% discipline, 50% not fooling yourself
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM A/B Test Analysis Guide<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            7-point checklist for reading results, 5 segmentation lenses, 6 common biases,
            and 5 decision rules for shipping or killing.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Experimentation Skills Daily — Free →
          </Link>
        </section>

        {/* Checklist */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">7-Point Reading Checklist</h2>
          <div className="space-y-2">
            {READING_CHECKLIST.map((r, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">☐</span>
                <p className="text-sm text-white/70">{r}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Segmentation */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Segmentation Lenses</h2>
            <div className="space-y-2">
              {SEGMENTATION_WINS.map((s, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Biases */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 Common Biases to Avoid</h2>
          <div className="space-y-2">
            {COMMON_BIASES.map((b, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-red-400 flex-shrink-0">⚠️</span>
                <p className="text-sm text-white/70">{b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Decision rules */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Decision Rules</h2>
            <div className="space-y-2">
              {DECISION_RULES.map((d, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{d}</p>
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
          <h2 className="text-2xl font-bold mb-3">Build Experimentation Intuition Daily</h2>
          <p className="text-white/60 mb-6">Daily scenarios on reading experiment results and making correct ship/kill calls.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
