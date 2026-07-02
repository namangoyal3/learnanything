import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Products (2026) — How to Ship AI Features That Users Trust",
  description:
    "How PMs build AI products that earn trust. Prompt design, evaluation, hallucination management, and the ethics of shipping AI features to real users.",
  keywords: [
    "PM AI products", "AI PM",
    "shipping AI features", "LLM product design",
    "AI product design 2026",
  ],
  alternates: { canonical: "/pm-ai-products" },
  openGraph: {
    title: "PM AI Products 2026 — PM Streak",
    description: "How PMs ship AI features that users trust — prompts, eval, hallucinations, ethics.",
    url: `${SITE_URL}/pm-ai-products`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+AI+Products+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM AI Products 2026 — PM Streak",
    description: "How PMs ship AI features that users trust — prompts, eval, hallucinations, ethics.",
    images: [`${SITE_URL}/api/og?title=PM+AI+Products+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const BUILDING_BLOCKS = [
  { block: "Prompt design", what: "Writing prompts that reliably produce good outputs across edge cases" },
  { block: "Model evaluation", what: "Testing output quality systematically before shipping" },
  { block: "Fallback UX", what: "Graceful handling when the model fails — don&apos;t just show errors" },
  { block: "Hallucination management", what: "Detecting and mitigating wrong-but-confident outputs" },
  { block: "Latency / cost trade-offs", what: "Which model, quality vs speed vs cost per call" },
  { block: "User trust signals", what: "Showing uncertainty, sources, opt-out — users trust systems that show limits" },
];

const COMMON_MISTAKES = [
  "Shipping AI without evaluation pipeline — can&apos;t tell if output is degrading",
  "Over-promising capability — &apos;AI that understands you perfectly&apos; never delivers",
  "Ignoring latency — 15-second responses kill UX even with great quality",
  "Hiding that output is AI-generated — trust erodes when users find out",
  "Not providing escape hatches — users need &apos;regenerate&apos;, &apos;edit&apos;, &apos;contact human&apos; options",
];

const TRUST_SIGNALS = [
  "Clearly label AI-generated content — transparency builds trust",
  "Show sources when applicable — &apos;based on document X&apos;",
  "Acknowledge uncertainty — &apos;I think...&apos; beats false confidence",
  "Easy to correct / regenerate — users know they can override",
  "Preserve user voice — AI that makes everything sound same loses personality",
  "Let users opt out — mandatory AI features frustrate power users",
];

const EVAL_APPROACHES = [
  "Golden dataset — curated examples with expected outputs",
  "LLM-as-judge — using models to evaluate other model outputs",
  "Human eval — expensive but irreplaceable for subjective quality",
  "User feedback loops — thumbs up/down, explicit ratings",
  "Automated regression tests — catch degradation in new model versions",
];

const FAQS = [
  {
    q: "What&apos;s the biggest difference between building AI products and traditional products?",
    a: "Non-deterministic outputs. Traditional products have consistent behaviour; AI products produce variable output each run. PMs must embrace this: design for variance, build eval systems, give users control to regenerate. PMs who expect deterministic AI behaviour ship fragile products.",
  },
  {
    q: "What&apos;s the biggest AI PM mistake?",
    a: "Shipping without evals. PMs get excited about a model that works on 5 demo inputs and ship to users who hit the long tail where it fails. Great AI PMs build evaluation pipelines before shipping, not after. An AI feature without evals is flying blind.",
  },
];

export default function PmAiProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Products", url: `${SITE_URL}/pm-ai-products` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🤖</span> AI products are probabilistic. PMs who expect determinism fail.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            6 AI product building blocks, 5 common mistakes, 6 trust signals, and 5 evaluation approaches.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI PM Skills Daily — Free →
          </Link>
        </section>

        {/* Building blocks */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 AI Product Building Blocks</h2>
          <div className="space-y-3">
            {BUILDING_BLOCKS.map((b, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                <p className="font-semibold text-white text-sm mb-1">{i + 1}. {b.block}</p>
                <p className="text-xs text-white/60">{b.what}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mistakes */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Common AI PM Mistakes</h2>
            <div className="space-y-2">
              {COMMON_MISTAKES.map((m, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{m}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust signals */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 Trust Signals for AI UX</h2>
          <div className="space-y-2">
            {TRUST_SIGNALS.map((t, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{t}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Eval approaches */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Evaluation Approaches</h2>
            <div className="space-y-2">
              {EVAL_APPROACHES.map((e, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{e}</p>
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
          <h2 className="text-2xl font-bold mb-3">Build AI PM Skills Daily</h2>
          <p className="text-white/60 mb-6">Daily scenarios on AI product design, evaluation, and responsible AI UX.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
