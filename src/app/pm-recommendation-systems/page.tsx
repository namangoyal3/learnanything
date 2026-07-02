import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Recommendation Systems (2026) — How PMs Work With ML Teams",
  description:
    "How PMs work with ML on recommendation systems. Candidate generation, ranking, diversity, and the PM&apos;s role when ML owns the model.",
  keywords: [
    "PM recommendation systems", "recsys PM",
    "ML product manager", "recommendation 2026",
  ],
  alternates: { canonical: "/pm-recommendation-systems" },
  openGraph: {
    title: "PM Recommendation Systems 2026 — PM Streak",
    description: "How PMs work with ML teams on recommendations.",
    url: `${SITE_URL}/pm-recommendation-systems`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Recommendation+Systems+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Recommendation Systems 2026 — PM Streak",
    description: "How PMs work with ML teams on recommendations.",
    images: [`${SITE_URL}/api/og?title=PM+Recommendation+Systems+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const LAYERS = [
  "Candidate generation — narrowing from millions to hundreds",
  "Ranking — ordering the candidates by predicted engagement",
  "Diversity and de-duplication — avoiding filter bubbles and repetition",
  "Business constraints — margin, freshness, content policy",
  "Post-ranking polish — presentation, thumbnails, labels",
];

const PM_LEVERS = [
  "Define the objective function — what are we optimising?",
  "Choose which signals are in scope — explicit ratings? implicit behaviour?",
  "Set guardrails — diversity, freshness, policy compliance",
  "Design the cold-start experience — new users, new items",
  "Own evaluation — offline metrics must predict online business outcomes",
];

const FAQS = [
  {
    q: "Do PMs need to understand ML to build recsys products?",
    a: "You don&apos;t need to write models, but you must understand the basic shape — candidate generation vs ranking, offline vs online evals, training data feedback loops, and why short-term engagement optimisation can destroy long-term retention. PMs who can&apos;t engage with ML tradeoffs get steamrolled by the ML team.",
  },
];

export default function PmRecommendationSystemsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Recommendation Systems", url: `${SITE_URL}/pm-recommendation-systems` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎯</span> ML owns the model. PM owns the objective function.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Recommendation Systems<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 system layers and 5 PM-owned levers in a recsys product.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Recsys PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 System Layers</h2>
          <div className="space-y-2">
            {LAYERS.map((l, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{l}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 PM Levers</h2>
            <div className="space-y-2">
              {PM_LEVERS.map((p, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{p}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Recsys PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
