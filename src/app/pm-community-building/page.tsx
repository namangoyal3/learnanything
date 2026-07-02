import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Community Building (2026) — How PMs Grow Engaged User Communities",
  description:
    "How PMs build communities that drive retention, advocacy, and product insight. Channels, rituals, and the metrics that matter.",
  keywords: [
    "PM community building", "community-led growth",
    "community PM", "user community 2026",
  ],
  alternates: { canonical: "/pm-community-building" },
  openGraph: {
    title: "PM Community Building 2026 — PM Streak",
    description: "How PMs grow engaged user communities — channels, rituals, metrics.",
    url: `${SITE_URL}/pm-community-building`,
    type: "article",
  },
};

const PRINCIPLES = [
  "Community is a product — treat it with the same rigor as your app",
  "Rituals beat features — weekly AMAs, monthly challenges compound trust",
  "Power users shape the tone — invest in the top 1% before the other 99%",
  "Moderation is infrastructure — without it, communities rot fast",
  "Host where users already are — Discord, Slack, WhatsApp, Telegram",
];

const METRICS = [
  "DAU/MAU of community — not just signups",
  "% of active users who post/reply per week",
  "Time-to-first-response — &lt;1 hour is the bar",
  "Top-contributor retention — are power users sticking?",
  "NPS of community members vs non-members",
];

const FAQS = [
  {
    q: "Should every product have a community?",
    a: "No. Communities work when users genuinely benefit from peer interaction — creator tools, dev tools, hobbies, learning. They don't work for utility products where users want to get in and out. Forcing community on the wrong product wastes PM and moderation bandwidth.",
  },
  {
    q: "Discord or Slack for community?",
    a: "Discord for consumer, creator, and gaming. Slack for B2B and prosumer. WhatsApp/Telegram for India-heavy audiences. The tool matters less than where your users already spend time.",
  },
];

export default function PmCommunityBuildingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Community Building", url: `${SITE_URL}/pm-community-building` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0e1113] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1f2228] border border-[#58cc02]/30 rounded-full px-4 py-1.5 text-sm text-[#89e219] mb-6">
            <span>👥</span> Community is the moat competitors can&apos;t copy
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Community Building<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 principles and 5 metrics that separate real communities from dead Discord servers.
          </p>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#46a302] active:border-b-2 active:translate-y-[2px] text-black font-black px-8 py-3 rounded-2xl transition-all">
            Build Community PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Principles</h2>
          <div className="space-y-2">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-[#89e219] font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#16181c] py-16">
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
          <h2 className="text-2xl font-bold mb-3">Practice Community PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] text-black font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
