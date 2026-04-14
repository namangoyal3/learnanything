import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Platform Strategy (2026) — When to Platform vs Ship a Feature | PM Streak",
  description:
    "How PMs decide when to build a platform vs a point solution. APIs, ecosystems, partner strategy, and the cost of platforming too early.",
  keywords: [
    "PM platform strategy", "platform vs feature",
    "platform PM", "ecosystem strategy 2026",
  ],
  alternates: { canonical: "/pm-platform-strategy" },
  openGraph: {
    title: "PM Platform Strategy 2026 — PM Streak",
    description: "When to platform, when to ship a feature, and how to tell the difference.",
    url: `${SITE_URL}/pm-platform-strategy`,
    type: "article",
  },
};

const WHEN_TO_PLATFORM = [
  "Three or more internal teams need the same capability",
  "Third parties are asking for an API and are willing to pay",
  "Your integrations with partners are becoming copy-paste",
  "The core primitive is stable enough to expose externally",
  "You have a team that can maintain SLAs across consumers",
];

const RISKS = [
  "Platforming too early locks in wrong abstractions — API changes are painful",
  "Internal consumers slow you down — every change needs partner alignment",
  "Developer community requires investment — docs, DX, evangelism",
  "Revenue model confusion — pricing APIs is harder than pricing features",
  "Support cost scales with consumers — each new partner = new tickets",
];

const FAQS = [
  {
    q: "Should every product eventually become a platform?",
    a: "No. Platforms work when you have a stable primitive that many teams or external parties want to build on. Many products are best as point solutions forever — trying to platform them dilutes focus and adds maintenance burden without commensurate value. Platform when the demand is pulled out of you, not when you push it.",
  },
];

export default function PmPlatformStrategyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Platform Strategy", url: `${SITE_URL}/pm-platform-strategy` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🧱</span> Platforms are 10x the work for 10x the leverage — if you&apos;re ready
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Platform Strategy<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 signals to platform and 5 risks of platforming too early.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Platform PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Signals to Platform</h2>
          <div className="space-y-2">
            {WHEN_TO_PLATFORM.map((w, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{w}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Risks</h2>
            <div className="space-y-2">
              {RISKS.map((r, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{r}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Platform PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
