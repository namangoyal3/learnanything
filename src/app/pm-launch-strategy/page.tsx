import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Launch Strategy (2026) — How PMs Run Real Product Launches | PM Streak",
  description:
    "How PMs plan launches that move metrics, not press. Launch tiers, rollout plans, press vs user-led launches, and common launch mistakes.",
  keywords: [
    "PM launch strategy", "product launch",
    "GTM PM", "launch plan 2026",
  ],
  alternates: { canonical: "/pm-launch-strategy" },
  openGraph: {
    title: "PM Launch Strategy 2026 — PM Streak",
    description: "How PMs run real product launches.",
    url: `${SITE_URL}/pm-launch-strategy`,
    type: "article",
  },
};

const TIERS = [
  { t: "Tier 1 — tentpole", w: "Year-defining launch. Press, keynote, coordinated marketing. Rare." },
  { t: "Tier 2 — feature launch", w: "Blog post, changelog, in-app announcement, maybe a video." },
  { t: "Tier 3 — quiet ship", w: "Rolled out silently; tracked via analytics. Most launches fall here." },
  { t: "Tier 4 — beta/early access", w: "Invite-only; gather feedback before broader launch." },
];

const STEPS = [
  "Define the success metric before you ship — otherwise you&apos;ll rationalise whatever happens",
  "Roll out gradually — 1%, 10%, 50%, 100% with kill-switches at each step",
  "Align GTM, support, sales on Day 1 messaging",
  "Instrument before launch — if you can&apos;t measure it, you can&apos;t learn from it",
  "Post-launch review — one doc, two weeks after ship: did it hit goals? What next?",
];

const FAQS = [
  {
    q: "Should every feature get a press launch?",
    a: "No. Most features don&apos;t warrant press. Over-launching trains press and users to tune you out. Reserve press launches for genuinely tentpole moments and let ordinary feature launches land with blog posts and in-app announcements. Volume of launches hurts future signal-to-noise ratio.",
  },
];

export default function PmLaunchStrategyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Launch Strategy", url: `${SITE_URL}/pm-launch-strategy` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🚀</span> The launch is the easy part. The follow-through is the hard part.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Launch Strategy<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            4 launch tiers and a 5-step checklist for PMs running real launches.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Launch PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">4 Launch Tiers</h2>
          <div className="space-y-3">
            {TIERS.map((t, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                <p className="font-semibold text-purple-400 text-sm mb-1">{t.t}</p>
                <p className="text-xs text-white/60">{t.w}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5-Step Checklist</h2>
            <div className="space-y-2">
              {STEPS.map((s, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
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
          <h2 className="text-2xl font-bold mb-3">Practice Launch Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
