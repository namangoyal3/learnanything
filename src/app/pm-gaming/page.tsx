import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Gaming (2026) — Dream11, MPL, Games24x7 PM Guide",
  description:
    "How PMs build gaming products in India. Retention loops, monetisation, real-money gaming regulation, and the unique PM challenges of games.",
  keywords: [
    "PM gaming", "Dream11 PM",
    "MPL PM", "gaming india 2026",
  ],
  alternates: { canonical: "/pm-gaming" },
  openGraph: {
    title: "PM Gaming 2026 — PM Streak",
    description: "How PMs build gaming products in India — retention, monetisation, regulation.",
    url: `${SITE_URL}/pm-gaming`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Gaming+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Gaming 2026 — PM Streak",
    description: "How PMs build gaming products in India — retention, monetisation, regulation.",
    images: [`${SITE_URL}/api/og?title=PM+Gaming+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Daily engagement is the product — no session, no revenue",
  "Whales pay the bills — top 1% of players generate 40–60% of revenue",
  "Live ops beats launch — weekly events and meta shifts retain users",
  "Regulation shifts the playing field — fantasy sports, rummy, poker rules evolve",
  "Social beats single-player — friends in-game lift D30 retention dramatically",
];

const METRICS = [
  "DAU and session count per DAU",
  "D1/D7/D30 retention curves",
  "ARPDAU — average revenue per daily active user",
  "Paying-user conversion rate and % of whales",
  "Match completion rate — drop-off mid-game is churn risk",
];

const QUESTIONS = [
  "Design a feature to convert free-to-play users to paying users without feeling pay-to-win",
  "DAU is flat but revenue is up — diagnose",
  "Design a seasonal event that drives 7-day re-engagement",
  "How would you reduce match-abandonment rate by 20%?",
];

const FAQS = [
  {
    q: "Is gaming PM niche or mainstream in India?",
    a: "Mainstream and growing. Dream11, MPL, Games24x7, WinZO, and NODWIN collectively employ hundreds of PMs. Skills transfer well to any engagement-driven consumer product — but the domain knowledge (live ops, economy design, meta balancing) is specialised and earned over years.",
  },
];

export default function PmGamingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Gaming", url: `${SITE_URL}/pm-gaming` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎮</span> Games are the purest form of engagement-as-product
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Gaming<br />(India Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics, 5 metrics, and 4 interview-style questions for gaming PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Gaming PM Skills — Free →
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
          <h2 className="text-2xl font-bold text-center mb-10">4 Interview Questions</h2>
          <div className="space-y-2">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-white/30 flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{q}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Gaming PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
