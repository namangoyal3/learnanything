import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Fine-Tuning vs Prompting (2026) — When PMs Should Push for Fine-Tuning",
  description:
    "When fine-tuning makes sense vs prompting or RAG. Cost, latency, control, and the real-world thresholds at which fine-tuning pays off.",
  keywords: [
    "PM fine tuning", "LLM fine tuning PM 2026",
  ],
  alternates: { canonical: "/pm-fine-tuning" },
  openGraph: {
    title: "PM Fine-Tuning vs Prompting 2026 — PM Streak",
    description: "When PMs should push for fine-tuning.",
    url: `${SITE_URL}/pm-fine-tuning`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Fine-Tuning+vs+Prompting+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Fine-Tuning vs Prompting 2026 — PM Streak",
    description: "When PMs should push for fine-tuning.",
    images: [`${SITE_URL}/api/og?title=PM+Fine-Tuning+vs+Prompting+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const WHEN = [
  "Style/format consistency at scale",
  "Reducing prompt size for cost or latency",
  "Tasks where examples in prompt are insufficient",
  "On-prem or air-gapped deployment requirements",
];

const WHEN_NOT = [
  "When prompting handles the task well enough",
  "When data for training is sparse or low-quality",
  "When base models update fast — fine-tunes need to keep up",
  "When the cost outweighs the latency or quality lift",
];

const FAQS = [
  {
    q: "Is fine-tuning still relevant in 2026?",
    a: "Yes for narrow, high-volume tasks where prompting hits cost or quality walls. For most apps, prompting + RAG is enough. Fine-tuning is a power tool — useful when needed, expensive when over-applied. Most teams should start with prompting and graduate to fine-tuning only when constraints demand it.",
  },
];

export default function PmFineTuningPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Fine-Tuning", url: `${SITE_URL}/pm-fine-tuning` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🛠️</span> Start with prompting. Graduate to fine-tuning only when needed.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Fine-Tuning vs Prompting<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            4 cases for fine-tuning and 4 cases against.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Fine-Tuning PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">When to Fine-Tune</h2>
          <div className="space-y-2">
            {WHEN.map((w, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{w}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">When Not To</h2>
            <div className="space-y-2">
              {WHEN_NOT.map((w, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{w}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Fine-Tuning Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
