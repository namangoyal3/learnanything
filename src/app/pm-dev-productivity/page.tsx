import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Developer Productivity (2026) — Measuring and Improving Eng Velocity | PM Streak",
  description:
    "How PMs work on developer productivity. DORA metrics, SPACE framework, AI coding tools, and why velocity is a team sport.",
  keywords: [
    "PM developer productivity", "DORA metrics",
    "SPACE framework", "eng velocity 2026",
  ],
  alternates: { canonical: "/pm-dev-productivity" },
  openGraph: {
    title: "PM Developer Productivity 2026 — PM Streak",
    description: "Measuring and improving engineering velocity.",
    url: `${SITE_URL}/pm-dev-productivity`,
    type: "article",
  },
};

const FRAMEWORKS = [
  "DORA — deployment frequency, lead time, change failure rate, MTTR",
  "SPACE — satisfaction, performance, activity, communication, efficiency",
  "Flow metrics — WIP, cycle time, throughput",
  "Developer experience surveys — quarterly, qualitative companion to metrics",
];

const TOOLS = [
  "LinearB, Swarmia, Jellyfish — DORA/SPACE dashboards",
  "GitHub Copilot, Cursor — AI-assisted coding",
  "Internal platforms — CI, CD, feature flags, observability stack",
  "Developer surveys — direct signal, not just metric proxies",
];

const FAQS = [
  {
    q: "Can individual developer productivity be measured?",
    a: "Partly. Team-level metrics (DORA, SPACE) are sound. Individual metrics become perverse incentives — devs optimise for the metric (lines of code, PR count) rather than outcomes. Focus on team health, remove blockers, and let managers handle individual performance via conversation, not dashboards.",
  },
];

export default function PmDevProductivityPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Developer Productivity", url: `${SITE_URL}/pm-dev-productivity` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>⚙️</span> Velocity is a team sport. Measure teams, coach individuals.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Developer Productivity<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            4 frameworks and 4 tool categories for measuring and improving eng velocity.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Dev Productivity Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">4 Frameworks</h2>
          <div className="space-y-2">
            {FRAMEWORKS.map((f, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{f}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Tool Categories</h2>
            <div className="space-y-2">
              {TOOLS.map((t, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
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
          <h2 className="text-2xl font-bold mb-3">Practice Dev Productivity Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
