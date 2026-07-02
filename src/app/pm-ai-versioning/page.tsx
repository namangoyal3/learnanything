import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Versioning (2026) — Managing Model and Prompt Versions",
  description:
    "How PMs version models and prompts. Pinning, migration, deprecation, and why model upgrades are silent product changes.",
  keywords: [
    "PM AI versioning", "model migration PM 2026",
  ],
  alternates: { canonical: "/pm-ai-versioning" },
  openGraph: {
    title: "PM AI Versioning 2026 — PM Streak",
    description: "Managing model and prompt versions.",
    url: `${SITE_URL}/pm-ai-versioning`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+AI+Versioning+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM AI Versioning 2026 — PM Streak",
    description: "Managing model and prompt versions.",
    images: [`${SITE_URL}/api/og?title=PM+AI+Versioning+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const PRACTICES = [
  "Pin model versions in production — automatic upgrades break things",
  "Run new models in shadow before promoting",
  "Eval suite is the gate for any version change",
  "Communicate model upgrades to enterprise customers",
  "Plan for model deprecation by vendors",
];

const TRAPS = [
  "Auto-upgrading to latest model — breaks behavior",
  "No prompt version control",
  "Skipping shadow tests because &apos;evals look fine&apos;",
  "No rollback path when a model regresses",
];

const FAQS = [
  {
    q: "How often do silent model changes break products?",
    a: "More often than vendors admit. OpenAI, Anthropic, Google all update underlying models periodically. Production AI products that don&apos;t pin or shadow-test see silent regressions monthly. PMs who treat models as code dependencies — versioned, tested, deprecated deliberately — ship more reliably.",
  },
];

export default function PmAiVersioningPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Versioning", url: `${SITE_URL}/pm-ai-versioning` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🔢</span> Treat models like code dependencies — version them
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Versioning<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 practices and 4 traps for AI versioning.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI Versioning PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Versioning Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
