import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Trade-Off Analysis (2026) — How to Make the Hard Calls Every Day",
  description:
    "How PMs analyse trade-offs systematically. Speed vs quality, simplicity vs flexibility, short-term vs long-term. The frameworks for hard calls every PM faces.",
  keywords: [
    "PM trade-offs", "product trade-off analysis",
    "hard product decisions", "PM decision framework",
    "weighing trade-offs PM 2026",
  ],
  alternates: { canonical: "/pm-trade-off-analysis" },
  openGraph: {
    title: "PM Trade-Off Analysis 2026 — PM Streak",
    description: "How PMs make hard trade-offs systematically — speed vs quality, short vs long, and more.",
    url: `${SITE_URL}/pm-trade-off-analysis`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Trade-Off+Analysis+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Trade-Off Analysis 2026 — PM Streak",
    description: "How PMs make hard trade-offs systematically — speed vs quality, short vs long, and more.",
    images: [`${SITE_URL}/api/og?title=PM+Trade-Off+Analysis+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const COMMON_TRADE_OFFS = [
  { tradeoff: "Speed vs Quality", context: "Ship fast with bugs, or slow with polish?", resolution: "Depends on stakes — low-risk features ship fast; payments/trust features ship polished" },
  { tradeoff: "Simplicity vs Flexibility", context: "Simple product with defaults, or flexible product with options?", resolution: "Match your user — novices want simple; power users want flex. Pick your primary user." },
  { tradeoff: "Short-term vs Long-term", context: "Ship metric-moving feature now, or invest in platform for future?", resolution: "70% short-term / 30% long-term as a rule of thumb; shift toward long-term at senior levels" },
  { tradeoff: "User delight vs Business metrics", context: "User-loved feature, or revenue-moving feature?", resolution: "Long-term, these align. Short-term, take business wins that don&apos;t damage UX irreversibly." },
  { tradeoff: "Customisation vs Opinionation", context: "Let users choose, or make the choice for them?", resolution: "Strong opinion by default, customisation as escape hatch. Pure customisation overwhelms." },
  { tradeoff: "Many users lightly vs Few users deeply", context: "Broad reach vs deep engagement with smaller segment?", resolution: "Depends on product stage — early stage, serve few deeply; scaling, broaden carefully." },
];

const FRAMEWORK_STEPS = [
  "Name the trade-off explicitly — &apos;this is a speed vs quality call&apos;",
  "Articulate both sides — what&apos;s the best version of each option?",
  "Identify what you&apos;re optimising for — which metric or outcome matters most?",
  "Consider reversibility — is this easy to undo later?",
  "Choose, commit, document why — not just what",
  "Revisit after 3 months — did the trade-off play out as expected?",
];

const AVOIDING_PITFALLS = [
  "Don&apos;t pretend trade-offs aren&apos;t real — &apos;we&apos;ll have both&apos; usually means neither",
  "Don&apos;t default to one side repeatedly — if you always pick speed, you&apos;ll accumulate quality debt",
  "Don&apos;t let trade-offs get personal — it&apos;s speed vs quality, not you vs them",
  "Don&apos;t make trade-offs in meetings — use written options to force specificity",
  "Don&apos;t avoid trade-offs by delaying — indecision is its own decision",
];

const FAQS = [
  {
    q: "How do PMs avoid paralysis when facing big trade-offs?",
    a: "Timebox the decision. Give yourself 2 days of analysis, then commit. Perfect trade-off analysis doesn&apos;t exist — reasonable analysis + commitment + learning beats endless deliberation. The PMs who get stuck on trade-offs usually think they need more information; often they need more courage.",
  },
  {
    q: "What&apos;s the biggest trade-off mistake PMs make?",
    a: "Pretending the trade-off isn&apos;t real. &apos;We&apos;ll be fast AND high-quality&apos; is a slogan, not a trade-off. The PMs who explicitly say &apos;we&apos;re choosing speed over quality here because X&apos; make faster, better decisions than PMs who paper over the choice.",
  },
];

export default function PmTradeOffAnalysisPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Trade-Off Analysis", url: `${SITE_URL}/pm-trade-off-analysis` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>⚖️</span> Every PM decision is a trade-off. Great PMs name them.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Trade-Off Analysis<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            6 common PM trade-offs with resolution guidance, 6-step decision framework,
            and 5 pitfalls that make trade-off analysis fail.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Judgment Daily — Free →
          </Link>
        </section>

        {/* Common trade-offs */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 Common PM Trade-Offs</h2>
          <div className="space-y-5">
            {COMMON_TRADE_OFFS.map((t, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-5">
                <p className="font-bold text-white mb-1">{i + 1}. {t.tradeoff}</p>
                <p className="text-sm text-white/60 mb-2">Context: {t.context}</p>
                <p className="text-xs text-purple-400">💡 Resolution: <span className="text-white/70">{t.resolution}</span></p>
              </div>
            ))}
          </div>
        </section>

        {/* Framework */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">6-Step Decision Framework</h2>
            <div className="space-y-2">
              {FRAMEWORK_STEPS.map((f, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pitfalls */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Pitfalls to Avoid</h2>
          <div className="space-y-2">
            {AVOIDING_PITFALLS.map((p, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-red-400 flex-shrink-0">❌</span>
                <p className="text-sm text-white/70">{p}</p>
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
          <h2 className="text-2xl font-bold mb-3">Build PM Judgment Under Pressure Daily</h2>
          <p className="text-white/60 mb-6">Daily scenarios that force explicit trade-offs — not avoidance.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
