import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Observability Products (2026) — Datadog, Honeycomb, Grafana PM Guide | PM Streak",
  description:
    "How PMs build observability products. Metrics, logs, traces, and why pricing is the hardest product decision in the category.",
  keywords: [
    "PM observability", "Datadog PM",
    "Honeycomb PM", "SRE PM 2026",
  ],
  alternates: { canonical: "/pm-observability" },
  openGraph: {
    title: "PM Observability 2026 — PM Streak",
    description: "How PMs build observability products.",
    url: `${SITE_URL}/pm-observability`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Observability+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Observability 2026 — PM Streak",
    description: "How PMs build observability products.",
    images: [`${SITE_URL}/api/og?title=PM+Observability+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Three pillars — metrics, logs, traces — bundled is sticky but expensive",
  "Pricing is the hardest product decision — cardinality, ingest, retention",
  "Alert noise is the enemy — too many alerts = no alerts",
  "Custom dashboards drive retention — power users build worlds",
  "OpenTelemetry reshaping interop — proprietary agents losing ground",
];

const METRICS = [
  "Monthly ingest volume",
  "Active custom dashboards per account",
  "Alert-to-investigation conversion",
  "Query P95 latency",
  "Seat-based adoption within customer orgs",
];

const FAQS = [
  {
    q: "Why is observability pricing so controversial?",
    a: "Because ingest-based pricing scales unpredictably with traffic. Customers get shocked bills when traffic spikes. Datadog grew fast on this model but faced pushback; Honeycomb and Grafana now compete on pricing predictability. In 2026, expect more value-based and hybrid models to emerge.",
  },
];

export default function PmObservabilityPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Observability", url: `${SITE_URL}/pm-observability` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📡</span> Pricing is the hardest product decision in observability
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Observability<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for observability PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Observability PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Observability Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
