import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Writing Products (2026) — Grammarly, Jasper, Notion AI PM Lessons",
  description:
    "How PMs build AI writing products. Inline vs chat, style adaptation, and why Grammarly had to reinvent itself in the LLM era.",
  keywords: [
    "PM AI writing", "Grammarly PM",
    "Jasper PM", "AI writing 2026",
  ],
  alternates: { canonical: "/pm-ai-writing" },
  openGraph: {
    title: "PM AI Writing Products 2026 — PM Streak",
    description: "How PMs build AI writing products.",
    url: `${SITE_URL}/pm-ai-writing`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+AI+Writing+Products+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM AI Writing Products 2026 — PM Streak",
    description: "How PMs build AI writing products.",
    images: [`${SITE_URL}/api/og?title=PM+AI+Writing+Products+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Inline suggestions beat chat for writing — don&apos;t break flow",
  "Style adaptation (to user&apos;s voice) is the retention lever",
  "Platform depth matters — Chrome extension, Word, Docs integrations",
  "Commoditisation pressure is real — underlying models are rented, not owned",
  "Enterprise trust features (data residency, audit logs) drive upmarket",
];

const METRICS = [
  "Acceptance rate of suggestions",
  "Words written with assistance per active day",
  "Style match rating (user feedback signal)",
  "Cross-platform adoption (extension + Word + web)",
  "Enterprise seat expansion",
];

const FAQS = [
  {
    q: "Did Grammarly successfully adapt to the LLM era?",
    a: "Mostly. They moved from grammar correction to broader writing assistance, but face real margin pressure as commoditised LLMs offer similar quality cheaper. Their moat is distribution (installed in 40M+ browsers, enterprise security features) rather than model quality. That moat will be tested.",
  },
];

export default function PmAiWritingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Writing", url: `${SITE_URL}/pm-ai-writing` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>✍️</span> Inline suggestions beat chat for real writing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Writing Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for AI writing product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI Writing PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Writing PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
