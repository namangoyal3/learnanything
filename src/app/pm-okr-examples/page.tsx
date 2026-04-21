import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM OKR Examples (2026) — Real Quarterly OKRs From Great Product Teams | PM Streak",
  description:
    "15+ real-style PM OKR examples for consumer, B2B, growth, and platform products. See what well-written Objectives + Key Results actually look like.",
  keywords: [
    "PM OKR examples", "product OKR templates",
    "real OKR examples", "quarterly OKR PM",
    "OKR template 2026",
  ],
  alternates: { canonical: "/pm-okr-examples" },
  openGraph: {
    title: "PM OKR Examples 2026 — PM Streak",
    description: "15+ real-style PM OKR examples across consumer, B2B, growth, and platform.",
    url: `${SITE_URL}/pm-okr-examples`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+OKR+Examples+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM OKR Examples 2026 — PM Streak",
    description: "15+ real-style PM OKR examples across consumer, B2B, growth, and platform.",
    images: [`${SITE_URL}/api/og?title=PM+OKR+Examples+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const OKR_SETS = [
  {
    category: "Consumer Growth PM",
    objective: "Make daily practice a real habit for Indian PM candidates",
    krs: [
      "Grow Day-7 retention from 22% to 32% (industry benchmark for learning apps)",
      "Increase daily active streaks from 1,200 to 4,500",
      "Launch streak-saver feature; 60% of active users engage with it",
    ],
  },
  {
    category: "B2B SaaS PM",
    objective: "Turn free trials into delighted, paying customers",
    krs: [
      "Lift free-to-paid conversion from 8% to 14%",
      "Reduce time-to-first-value from 4.5 days to 2 days",
      "Achieve NRR of 115% (from 102%) across mid-market accounts",
    ],
  },
  {
    category: "Fintech Payments PM",
    objective: "Make payments feel reliable at scale",
    krs: [
      "Improve payment success rate from 95.2% to 97.5%",
      "Reduce failed-payment-to-retry time from 90 sec to 30 sec",
      "Ship structured error messages; cut support tickets about payment failures by 30%",
    ],
  },
  {
    category: "Platform PM",
    objective: "Make the feature flag system the one engineers trust",
    krs: [
      "Increase flag adoption from 40% of deploys to 80%",
      "Reduce rollback time from 15 min to &lt;2 min",
      "Ship preview UI; 90% of eng team uses it before flag changes",
    ],
  },
  {
    category: "Marketplace PM",
    objective: "Grow supplier density enough to reduce wait times meaningfully",
    krs: [
      "Grow active suppliers from 8,000 to 15,000 in target cities",
      "Reduce average wait time from 6 min to 3.5 min",
      "Maintain supplier NPS above 50 (don&apos;t grow at supplier expense)",
    ],
  },
];

const PATTERNS = [
  "Objectives are ambitious and qualitative — &apos;make X feel Y&apos;, not &apos;ship 5 features&apos;",
  "Key Results are measurable with specific numbers and baselines",
  "KRs target 40–60% improvement — not 5% (too small) or 10x (too wild)",
  "Each OKR has 3–4 KRs — more becomes noise",
  "Guardrails included where appropriate (e.g., maintain NPS, don&apos;t harm suppliers)",
  "Each KR is something the team can actually influence",
];

const FAQS = [
  {
    q: "How many OKRs should a PM team have per quarter?",
    a: "1 Objective with 3–4 Key Results is ideal. 2 Objectives is acceptable for larger teams. More than 2 Objectives dilutes focus — you&apos;re trying to do too much at once. The discipline of choosing the one thing that matters most is what makes OKRs valuable.",
  },
  {
    q: "Are OKRs the same as KPIs?",
    a: "No. KPIs are ongoing metrics you always track (DAU, retention, revenue). OKRs are time-bound bets — &apos;this quarter we&apos;ll move X from A to B.&apos; A good OKR often targets moving a KPI meaningfully. Confusing the two is common and weakens both.",
  },
];

export default function PmOkrExamplesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM OKR Examples", url: `${SITE_URL}/pm-okr-examples` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎯</span> See what great OKRs actually look like
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM OKR Examples<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 real-style OKRs across consumer, B2B, fintech, platform, and marketplace —
            plus 6 patterns that separate great OKRs from generic ones.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Goal-Setting Skills Daily — Free →
          </Link>
        </section>

        {/* OKRs */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="space-y-6">
            {OKR_SETS.map((okr, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">{okr.category}</p>
                <p className="font-bold text-white mb-4">O: {okr.objective}</p>
                <div className="space-y-2">
                  {okr.krs.map((kr, j) => (
                    <div key={j} className="bg-[#0a0a0a] rounded-lg p-3 flex gap-3">
                      <span className="text-purple-400 font-bold flex-shrink-0">KR{j + 1}:</span>
                      <p className="text-sm text-white/70">{kr}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Patterns */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">6 Patterns Across Great OKRs</h2>
            <div className="space-y-2">
              {PATTERNS.map((p, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{p}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice OKR Writing Daily</h2>
          <p className="text-white/60 mb-6">Daily scenarios on goal-setting, prioritisation, and measurable commitments.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
