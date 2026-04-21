import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Prompt Engineering (2026) — How PMs Should Think About Prompts | PM Streak",
  description:
    "How PMs handle prompt engineering. Versioning, evals, system prompts, and why prompt engineering is product engineering, not a hack.",
  keywords: [
    "PM prompt engineering", "prompt PM 2026",
  ],
  alternates: { canonical: "/pm-prompt-engineering" },
  openGraph: {
    title: "PM Prompt Engineering 2026 — PM Streak",
    description: "How PMs should think about prompts.",
    url: `${SITE_URL}/pm-prompt-engineering`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Prompt+Engineering+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Prompt Engineering 2026 — PM Streak",
    description: "How PMs should think about prompts.",
    images: [`${SITE_URL}/api/og?title=PM+Prompt+Engineering+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const PRACTICES = [
  "Treat prompts as code — version control, review, eval",
  "System prompt sets behaviour; user prompt carries variables",
  "Use few-shot examples for tasks the model struggles with",
  "Constrain output formats explicitly (JSON, schema)",
  "Test across model versions — vendors update silently",
];

const TRAPS = [
  "Treating prompts as casual text instead of code",
  "No regression tests after prompt changes",
  "Over-engineering simple prompts",
  "Skipping the system prompt entirely",
];

const FAQS = [
  {
    q: "Is prompt engineering a real PM skill?",
    a: "Increasingly yes. Senior PMs at AI companies own prompts as core product surface. Versioning, eval, and rollback for prompts are now PM-discipline expectations. Treating prompts as one-off text leads to silent regressions and brand risk. Treat them like code.",
  },
];

export default function PmPromptEngineeringPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Prompt Engineering", url: `${SITE_URL}/pm-prompt-engineering` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📝</span> Treat prompts as code, not casual text
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Prompt Engineering<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 practices and 4 traps for PM prompt engineering.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Prompt PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Practices</h2>
          <div className="space-y-2">
            {PRACTICES.map((p, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Traps</h2>
            <div className="space-y-2">
              {TRAPS.map((t, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{t}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Prompt Engineering Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
