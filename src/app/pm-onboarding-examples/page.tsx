import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Onboarding Examples (2026) — 5 Great Product Onboardings Broken Down",
  description:
    "5 great product onboardings broken down. Duolingo, Slack, Notion, Zepto, Razorpay — what they get right, what a PM would copy, and what they&apos;d change.",
  keywords: [
    "product onboarding examples", "great onboarding PM",
    "Duolingo onboarding", "Slack onboarding",
    "onboarding design 2026",
  ],
  alternates: { canonical: "/pm-onboarding-examples" },
  openGraph: {
    title: "PM Onboarding Examples 2026 — PM Streak",
    description: "5 great product onboardings broken down — what they get right and what a PM would change.",
    url: `${SITE_URL}/pm-onboarding-examples`,
    type: "article",
  },
};

const EXAMPLES = [
  {
    product: "Duolingo",
    strength: "&apos;Start learning before signup&apos; — users take a lesson before creating account, proving value first",
    copy: "Deferred signup — test product value before asking for commitment",
    change: "Could personalise initial lesson more based on onboarding quiz",
  },
  {
    product: "Slack",
    strength: "Workspace-first onboarding with pre-filled sample channels — team context immediately visible",
    copy: "Set up workspace with context, not blank — users see what good looks like",
    change: "New user joining existing workspace has weaker onboarding than founder did",
  },
  {
    product: "Notion",
    strength: "Template gallery immediately after signup — users pick their use case, see value faster",
    copy: "Let users self-identify their use case; personalise the initial experience",
    change: "For non-technical users, the blank canvas is still intimidating despite templates",
  },
  {
    product: "Zepto",
    strength: "Instant value via fast delivery — your first order arrives in 10 min, better than competitor promises",
    copy: "Let the core product experience be the onboarding — nothing else needed",
    change: "First-time Tier-2/3 users could use more trust-building (reviews, guarantees)",
  },
  {
    product: "Razorpay",
    strength: "Two-track onboarding — &apos;generate a payment link&apos; vs &apos;full integration&apos; — meets users where they are",
    copy: "Segment onboarding by user intent; one path doesn&apos;t fit all",
    change: "Dashboard feels overwhelming post-onboarding for first-time merchants",
  },
];

const COMMON_STRENGTHS = [
  "Time to value is short — users see benefit in first session",
  "Clear next step — no wall-of-options; focused progression",
  "Deferred friction — signup, profile, config move after value is felt",
  "Segmented paths — different users get different experiences",
  "Built-in trust signals — reviews, sample content, social proof",
];

const COMMON_WEAKNESSES = [
  "Onboarding gets stale — didn&apos;t evolve with product",
  "Works for primary persona but not edge personas",
  "Too tied to signup — repeat users don&apos;t get re-onboarded after changes",
  "Ignored on smaller devices / slow networks",
  "Metric-optimised for activation but not long-term retention",
];

const FAQS = [
  {
    q: "What&apos;s the most underrated onboarding pattern?",
    a: "Deferred signup — letting users experience the product before creating an account. Duolingo and many mobile games do this well. Most products gate value behind signup, losing users who would have loved it. The fear: &apos;they won&apos;t sign up.&apos; Reality: users who experience value sign up at much higher rates than those shown a signup wall first.",
  },
  {
    q: "How should PMs measure onboarding success?",
    a: "Three layers: (1) activation rate — % who reach aha, (2) time to activation — how fast they get there, (3) retention of activated users — do activated users stick? Optimising just for activation without retention leads to shallow wins. The goal: both activate AND retain. Activated users who churn = onboarding is over-promising.",
  },
];

export default function PmOnboardingExamplesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Onboarding Examples", url: `${SITE_URL}/pm-onboarding-examples` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🚪</span> Study great onboardings. Steal the pattern, not the pixels.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Onboarding Examples<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 great onboardings (Duolingo, Slack, Notion, Zepto, Razorpay) broken down, with what to copy and what to change.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Onboarding Skills Daily — Free →
          </Link>
        </section>

        {/* Examples */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="space-y-5">
            {EXAMPLES.map((e, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-2xl p-5">
                <p className="font-bold text-white mb-2">{i + 1}. {e.product}</p>
                <div className="space-y-2">
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                    <p className="text-xs text-green-400 mb-1">✅ Strength</p>
                    <p className="text-sm text-white/70">{e.strength}</p>
                  </div>
                  <div className="bg-[#7c3aed]/5 border border-[#7c3aed]/20 rounded-lg p-3">
                    <p className="text-xs text-purple-400 mb-1">💡 What to copy</p>
                    <p className="text-sm text-white/70">{e.copy}</p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                    <p className="text-xs text-yellow-400 mb-1">🔧 What a PM would change</p>
                    <p className="text-sm text-white/70">{e.change}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common strengths */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Common Onboarding Strengths</h2>
            <div className="space-y-2">
              {COMMON_STRENGTHS.map((c, i) => (
                <div key={i} className="bg-[#111] border border-green-500/20 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <p className="text-sm text-white/70">{c}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common weaknesses */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Common Onboarding Weaknesses</h2>
          <div className="space-y-2">
            {COMMON_WEAKNESSES.map((c, i) => (
              <div key={i} className="bg-[#111] border border-red-500/20 rounded-xl p-3 flex gap-3">
                <span className="text-red-400 flex-shrink-0">⚠️</span>
                <p className="text-sm text-white/70">{c}</p>
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
          <h2 className="text-2xl font-bold mb-3">Build PM Onboarding Intuition Daily</h2>
          <p className="text-white/60 mb-6">Daily scenarios on onboarding design, activation, and first-session value.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
