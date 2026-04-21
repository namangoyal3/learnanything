import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM + QA Partnership (2026) — How PMs and QA Ship Higher Quality Together | PM Streak",
  description:
    "How PMs work with QA to ship higher quality faster. Test plans, shifting QA left, bug triage, and the PM + QA habits that matter.",
  keywords: [
    "PM QA", "PM and QA partnership",
    "shift left testing PM", "PM quality",
    "PM QA collaboration 2026",
  ],
  alternates: { canonical: "/pm-qa-partnership" },
  openGraph: {
    title: "PM + QA Partnership 2026 — PM Streak",
    description: "How PMs and QA ship higher quality together — test plans, shift left, triage.",
    url: `${SITE_URL}/pm-qa-partnership`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+++QA+Partnership+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM + QA Partnership 2026 — PM Streak",
    description: "How PMs and QA ship higher quality together — test plans, shift left, triage.",
    images: [`${SITE_URL}/api/og?title=PM+++QA+Partnership+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const WHAT_PM_OWES_QA = [
  "Clear acceptance criteria — every user story has testable conditions",
  "Early visibility — QA sees PRDs and designs, not just finished code",
  "Test plan collaboration — QA should help define edge cases before eng starts",
  "Time to test — don&apos;t squeeze QA at end of sprint",
  "Context on business impact — why this feature matters helps QA prioritise",
];

const WHAT_QA_OWES_PM = [
  "Test coverage — understanding what&apos;s tested vs not",
  "Risk-based prioritisation — not all bugs are equal",
  "Reproduction steps for bugs — save eng time",
  "Regression testing — making sure old features don&apos;t break",
  "Release quality signoff — clear yes/no, not wishy-washy",
];

const BUG_TRIAGE = [
  { priority: "P0 — Blocker", what: "Stops all users or business revenue. Fix before release or pull release." },
  { priority: "P1 — Critical", what: "Affects major flow or key segment. Fix in same sprint." },
  { priority: "P2 — Important", what: "Degraded experience for some users. Fix in next sprint." },
  { priority: "P3 — Minor", what: "Small issues with workarounds. Schedule for backlog." },
  { priority: "P4 — Cosmetic", what: "Visual polish. Batch for later cleanup sprint or defer." },
];

const SHIFT_LEFT = [
  "Involve QA in PRD review — edge cases surface earlier",
  "Write testable acceptance criteria — not vague &apos;user can do X&apos;",
  "Pair QA with design to spot UX issues before build",
  "Run QA during dev, not just at end — continuous testing",
  "Use feature flags so QA can test in production safely",
];

const FAQS = [
  {
    q: "Who owns product quality — PM or QA?",
    a: "Both, but PM is ultimately accountable. QA catches bugs; PM decides which to fix before ship. PMs who push back against QA to ship faster, then own the fallout, build credibility. PMs who blame QA when bugs ship don&apos;t. Quality is a PM decision as much as a QA one.",
  },
  {
    q: "What&apos;s the biggest PM + QA relationship mistake?",
    a: "Treating QA as a final gate instead of a partner. PMs who loop QA in only at end of sprint create rushed, stressful test cycles and worse quality. PMs who partner with QA from PRD review onwards ship higher-quality products with less friction.",
  },
];

export default function PmQaPartnershipPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM + QA Partnership", url: `${SITE_URL}/pm-qa-partnership` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🧪</span> Quality isn&apos;t QA&apos;s problem — it&apos;s a PM decision
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM + QA Partnership Guide<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            What PMs owe QA, what QA owes PMs, bug triage priority system, and 5 ways to shift testing left.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Quality Skills Daily — Free →
          </Link>
        </section>

        {/* PM owes QA */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Things PMs Owe QA</h2>
          <div className="space-y-2">
            {WHAT_PM_OWES_QA.map((w, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{w}</p>
              </div>
            ))}
          </div>
        </section>

        {/* QA owes PM */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Things QA Owes PMs</h2>
            <div className="space-y-2">
              {WHAT_QA_OWES_PM.map((w, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{w}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bug triage */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">5-Level Bug Triage System</h2>
          <div className="space-y-3">
            {BUG_TRIAGE.map((b, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                <p className="font-semibold text-purple-400 text-sm mb-1">{b.priority}</p>
                <p className="text-xs text-white/60">{b.what}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Shift left */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Ways to Shift Testing Left</h2>
            <div className="space-y-2">
              {SHIFT_LEFT.map((s, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
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
          <h2 className="text-2xl font-bold mb-3">Build PM Quality Skills Daily</h2>
          <p className="text-white/60 mb-6">Daily scenarios on acceptance criteria, test planning, and ship/don&apos;t-ship decisions.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
