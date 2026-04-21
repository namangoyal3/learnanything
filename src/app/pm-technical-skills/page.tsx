import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Technical Skills (2026) — How Technical Should a PM Be? | PM Streak",
  description:
    "The technical skills every PM should have in 2026. SQL, APIs, systems thinking, and how to talk to engineers without faking it.",
  keywords: [
    "PM technical skills", "technical product manager",
    "SQL for PM", "APIs for PM 2026",
  ],
  alternates: { canonical: "/pm-technical-skills" },
  openGraph: {
    title: "PM Technical Skills 2026 — PM Streak",
    description: "How technical should a PM be? SQL, APIs, systems thinking.",
    url: `${SITE_URL}/pm-technical-skills`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Technical+Skills+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Technical Skills 2026 — PM Streak",
    description: "How technical should a PM be? SQL, APIs, systems thinking.",
    images: [`${SITE_URL}/api/og?title=PM+Technical+Skills+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const BASELINE = [
  "SQL — joins, aggregations, window functions. Enough to self-serve analytics.",
  "APIs — REST basics, reading OpenAPI specs, making a call with curl or Postman",
  "Systems thinking — client/server, caching, queues, databases at a conceptual level",
  "Git basics — reading diffs and PR descriptions; you don&apos;t need to merge",
  "One modern primitive — webhooks, feature flags, or event tracking. Pick one and be fluent.",
];

const DEEP_DIVES = [
  "ML/AI PM — embeddings, evals, prompt engineering, model trade-offs",
  "Infra PM — latency budgets, SLOs, observability, capacity planning",
  "Data PM — pipelines, warehousing, dbt, quality checks",
  "Security PM — authN vs authZ, threat modeling, OWASP top 10",
];

const FAQS = [
  {
    q: "Do PMs need to code?",
    a: "No, but you should be able to read code. Knowing a language well enough to understand a PR diff, read an error stack trace, and build a tiny prototype in Replit or a no-code tool is table-stakes in 2026. Shipping production code is not required.",
  },
];

export default function PmTechnicalSkillsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Technical Skills", url: `${SITE_URL}/pm-technical-skills` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🧠</span> Technical depth is a force-multiplier, not a prerequisite
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Technical Skills<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 baseline skills every PM should have and 4 deep dives by domain.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Technical PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Baseline Skills</h2>
          <div className="space-y-2">
            {BASELINE.map((b, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Deep Dives by Domain</h2>
            <div className="space-y-2">
              {DEEP_DIVES.map((d, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{d}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Technical PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
