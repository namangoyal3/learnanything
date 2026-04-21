import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Growth Loops (2026) — The Engines Behind Compounding Growth | PM Streak",
  description:
    "How PMs build growth loops. Viral, content, paid, PLG — what each loop does, when it works, and how to diagnose a loop that&apos;s broken.",
  keywords: [
    "PM growth loops", "viral loop PM",
    "content loop PM", "PLG loop",
    "product growth engine 2026",
  ],
  alternates: { canonical: "/pm-growth-loops" },
  openGraph: {
    title: "PM Growth Loops 2026 — PM Streak",
    description: "How PMs build growth loops — viral, content, paid, PLG — and diagnose broken ones.",
    url: `${SITE_URL}/pm-growth-loops`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Growth+Loops+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Growth Loops 2026 — PM Streak",
    description: "How PMs build growth loops — viral, content, paid, PLG — and diagnose broken ones.",
    images: [`${SITE_URL}/api/og?title=PM+Growth+Loops+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const LOOPS = [
  { loop: "Viral loop", description: "User invites others who become users who invite others. Self-reinforcing.", example: "WhatsApp: you join because friends are there, and invite more friends." },
  { loop: "Content loop", description: "User creates content that attracts more users via search / social.", example: "Quora: questions asked rank on Google, bringing more visitors, who ask more questions." },
  { loop: "Paid loop", description: "Revenue from users pays to acquire more users, compounding scale.", example: "SaaS: ₹1 LTV × conversion × paid CAC = growing ad budget each month." },
  { loop: "PLG loop (product-led growth)", description: "Product usage expands to teams/orgs, generating more revenue and more users.", example: "Slack: one team adopts → colleagues join → company buys enterprise." },
  { loop: "Network-effect loop", description: "Product becomes more valuable as more users join, retaining each better.", example: "Uber: more riders attract more drivers, which reduces wait times, which attracts more riders." },
];

const BUILDING = [
  "Start with a &apos;single loop&apos; mindset — which ONE loop should your product optimise for?",
  "Map each step of the loop explicitly — where does a user become an input to the next cycle?",
  "Instrument each step — conversion at every loop stage",
  "Identify the leakiest step — fixing there has highest ROI",
  "Measure loop velocity — how fast does one cycle complete? Faster = more compound",
];

const DIAGNOSING_BROKEN = [
  "If virality is weak: Is there a natural share moment? Are we making sharing easy?",
  "If content isn&apos;t driving growth: Are we creating indexable content? Is SEO working?",
  "If paid isn&apos;t working: Is CAC &lt; LTV? Are we acquiring the right users?",
  "If PLG is stalling: Is the product valuable solo? Does team adoption create more value?",
  "If network effects weak: Are new users getting value without needing many others first?",
];

const COMPOUND_TESTS = [
  "If we doubled users, would LTV stay the same or grow? (Yes = network effects)",
  "Do users acquired in month 1 bring new users in month 2? (Yes = viral/content)",
  "Does ad spend per new user stay flat or drop as we scale? (Yes = working paid loop)",
  "Do individual users&apos; accounts tend to grow over time? (Yes = PLG working)",
  "Is organic traffic growing faster than paid acquisition? (Yes = content loop working)",
];

const FAQS = [
  {
    q: "Should every product have a growth loop?",
    a: "Every product should have at least ONE working loop, or growth requires constant new ad spend. The strongest companies have multiple compounding loops. Products with no loops hit a plateau where each new user costs the same as the last — unsustainable at scale.",
  },
  {
    q: "What&apos;s the biggest PM mistake with growth loops?",
    a: "Confusing &apos;features that might drive growth&apos; with actual loops. A referral program with 3% share rate isn&apos;t a loop — it&apos;s a nice-to-have. A real loop has clear &apos;input → process → output → back to input&apos; structure with measurable compounding. If you can&apos;t diagram it on a whiteboard, you don&apos;t have a loop yet.",
  },
];

export default function PmGrowthLoopsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Growth Loops", url: `${SITE_URL}/pm-growth-loops` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🔄</span> Growth without loops is just ads. Loops compound.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Growth Loops Guide<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 types of growth loops, 5 steps to build one, 5 diagnostic questions for broken loops,
            and 5 tests for compounding growth.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Growth PM Skills Daily — Free →
          </Link>
        </section>

        {/* Loops */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Types of Growth Loops</h2>
          <div className="space-y-4">
            {LOOPS.map((l, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-5">
                <p className="font-bold text-white mb-1">{i + 1}. {l.loop}</p>
                <p className="text-sm text-white/70 mb-2">{l.description}</p>
                <p className="text-xs text-purple-400">💡 Example: <span className="text-white/70">{l.example}</span></p>
              </div>
            ))}
          </div>
        </section>

        {/* Building */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Steps to Build a Loop</h2>
            <div className="space-y-2">
              {BUILDING.map((b, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Diagnosing */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Diagnostics for Broken Loops</h2>
          <div className="space-y-2">
            {DIAGNOSING_BROKEN.map((d, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-yellow-400 flex-shrink-0">⚠️</span>
                <p className="text-sm text-white/70">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compound tests */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Tests for Compounding Growth</h2>
            <div className="space-y-2">
              {COMPOUND_TESTS.map((c, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
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
          <h2 className="text-2xl font-bold mb-3">Build Growth PM Intuition Daily</h2>
          <p className="text-white/60 mb-6">Daily scenarios on loops, funnels, retention, and compounding product mechanics.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
