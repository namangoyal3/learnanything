import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM MarTech (2026) — Segment, Braze, MoEngage PM Guide | PM Streak",
  description:
    "How PMs build MarTech products. CDP, engagement, attribution, and why MarTech is consolidating around data + activation.",
  keywords: [
    "PM MarTech", "Braze PM",
    "MoEngage PM", "CDP 2026",
  ],
  alternates: { canonical: "/pm-martech" },
  openGraph: {
    title: "PM MarTech 2026 — PM Streak",
    description: "How PMs build MarTech products.",
    url: `${SITE_URL}/pm-martech`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+MarTech+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM MarTech 2026 — PM Streak",
    description: "How PMs build MarTech products.",
    images: [`${SITE_URL}/api/og?title=PM+MarTech+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "CDP + engagement is the stack — data pipes to activation",
  "Attribution is the hard problem — multi-touch, post-iOS14, post-cookie",
  "Deliverability owns trust — one bad campaign tanks domain reputation",
  "AI rewriting segmentation and content — natural language replaces rule builders",
  "Compliance (DPDP, GDPR) is a product requirement, not a feature",
];

const METRICS = [
  "Campaign delivery rate (email, push, SMS)",
  "Conversion lift from triggered vs broadcast",
  "Active daily campaigns per account (depth of usage)",
  "Attribution accuracy (when checked against conversions)",
  "Latency of real-time triggers",
];

const FAQS = [
  {
    q: "Will MarTech consolidate further in 2026?",
    a: "Yes. Point tools (analytics, CDP, engagement, attribution) are merging into suites. Braze, MoEngage, and Segment/Twilio lead in the consolidated space. Stand-alone tools on a single category struggle unless they&apos;re absolute best-in-class and easily integrated into existing stacks.",
  },
];

export default function PmMarTechPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM MarTech", url: `${SITE_URL}/pm-martech` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📣</span> Data without activation is a museum
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM MarTech<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for MarTech PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build MarTech PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Dynamics</h2>
          <div className="space-y-2">
            {DYNAMICS.map((d, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Metrics</h2>
            <div className="space-y-2">
              {METRICS.map((m, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{m}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice MarTech PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
