import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Roadmap Communication (2026) — How to Share Roadmaps Without Over-Committing | PM Streak",
  description:
    "How PMs communicate roadmaps to different audiences. Internal vs external, sales vs customers, execs vs engineering — what to share and how.",
  keywords: [
    "PM roadmap communication", "share roadmap PM",
    "external roadmap PM", "customer roadmap share",
    "PM roadmap audiences 2026",
  ],
  alternates: { canonical: "/pm-roadmap-communication" },
  openGraph: {
    title: "PM Roadmap Communication 2026 — PM Streak",
    description: "How PMs share roadmaps without over-committing — different audiences, different messages.",
    url: `${SITE_URL}/pm-roadmap-communication`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Roadmap+Communication+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Roadmap Communication 2026 — PM Streak",
    description: "How PMs share roadmaps without over-committing — different audiences, different messages.",
    images: [`${SITE_URL}/api/og?title=PM+Roadmap+Communication+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const AUDIENCES = [
  { audience: "Engineering team", share: "Detailed sprint-level + quarterly bets", format: "Jira + shared Notion doc", caution: "Don&apos;t over-commit timelines engineering hasn&apos;t sized" },
  { audience: "Design team", share: "Same as engineering + earlier input on what&apos;s coming", format: "Shared doc + design review sessions", caution: "Loop them in before scope is locked" },
  { audience: "Sales / Customer success", share: "Quarterly directional themes, not specific features", format: "Quarterly sales enablement deck", caution: "Never give commit-level detail — sales will sell it" },
  { audience: "Executives", share: "Strategic bets + outcomes targeted", format: "Short deck or 1-pager, reviewed quarterly", caution: "Keep it at outcome level — not feature-level" },
  { audience: "Customers (public)", share: "Broad themes, no dates", format: "Now/Next/Later format on a status page", caution: "Never promise features with specific dates externally" },
];

const MESSAGES_BY_AUDIENCE = [
  { audience: "To engineering", message: "&apos;This is what we&apos;re committing to this sprint, and here&apos;s what&apos;s directionally coming next quarter.&apos;" },
  { audience: "To sales", message: "&apos;This quarter we&apos;re focused on X. We&apos;ll review again in 90 days. Don&apos;t promise anything specific.&apos;" },
  { audience: "To executives", message: "&apos;Our Q3 bets are X and Y. Expected outcome: move metric Z by W%.&apos;" },
  { audience: "To customers", message: "&apos;We&apos;re investing in A, B, C areas. Timelines shared closer to launch.&apos;" },
];

const COMMON_MISTAKES = [
  "Sharing the same roadmap with everyone — different audiences need different detail levels",
  "Giving sales commit-level detail — they&apos;ll sell features that slip",
  "External roadmaps with specific dates — customers anchor on them, complain if you miss",
  "Not updating regularly — stale roadmaps are worse than no roadmaps",
  "Vague language in internal roadmap — engineering needs specifics to plan",
  "Promising what&apos;s not committed — erodes trust when things shift",
];

const FAQS = [
  {
    q: "Should PMs publish a public roadmap?",
    a: "For B2B SaaS with strong customer relationships, yes — but in Now/Next/Later format without specific dates. For consumer products, usually no — external roadmaps become promises, and consumer products need flexibility to pivot. Check what competitors do and match your customer expectations.",
  },
  {
    q: "How do PMs handle sales wanting specific dates for customer deals?",
    a: "Draw a line at &apos;directional&apos; for anything more than a quarter out. Provide &apos;targeting Q3&apos; not &apos;will ship July 15.&apos; When sales pushes harder (for a specific deal), escalate to engineering leadership to evaluate if that specific commitment is worth making. Never commit to dates without engineering sign-off — that erodes trust when it slips.",
  },
];

export default function PmRoadmapCommunicationPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Roadmap Communication", url: `${SITE_URL}/pm-roadmap-communication` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📣</span> Different audiences. Different messages. Same underlying roadmap.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Roadmap Communication<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 audiences with what/how/caution for each, 4 sample audience messages, and 6 mistakes that erode trust.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Communication Skills Daily — Free →
          </Link>
        </section>

        {/* Audiences */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Audiences for Your Roadmap</h2>
          <div className="space-y-4">
            {AUDIENCES.map((a, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-5">
                <p className="font-bold text-white mb-2">{i + 1}. {a.audience}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="bg-[#0a0a0a] rounded p-2">
                    <span className="text-purple-400 font-medium">Share: </span>
                    <span className="text-white/70">{a.share}</span>
                  </div>
                  <div className="bg-[#0a0a0a] rounded p-2">
                    <span className="text-purple-400 font-medium">Format: </span>
                    <span className="text-white/70">{a.format}</span>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded p-2">
                    <span className="text-red-400 font-medium">⚠️ </span>
                    <span className="text-white/70">{a.caution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Messages */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Sample Messages by Audience</h2>
            <div className="space-y-3">
              {MESSAGES_BY_AUDIENCE.map((m, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-purple-400 mb-1">{m.audience}</p>
                  <p className="text-sm text-white/70 italic">&ldquo;{m.message}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mistakes */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 Communication Mistakes</h2>
          <div className="space-y-2">
            {COMMON_MISTAKES.map((m, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-red-400 flex-shrink-0">❌</span>
                <p className="text-sm text-white/70">{m}</p>
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
          <h2 className="text-2xl font-bold mb-3">Build PM Communication Muscle Daily</h2>
          <p className="text-white/60 mb-6">Daily scenarios on audience-appropriate writing and stakeholder messaging.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
