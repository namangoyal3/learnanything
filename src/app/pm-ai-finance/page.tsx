import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Finance Products (2026) — Ramp, Brex, Pilot PM Lessons | PM Streak",
  description:
    "How PMs build AI finance products. Expense intelligence, close automation, forecasting, and why CFO-tech is where AI adoption is quietest but fastest.",
  keywords: [
    "PM AI finance", "Ramp PM",
    "Brex PM", "AI CFO 2026",
  ],
  alternates: { canonical: "/pm-ai-finance" },
  openGraph: {
    title: "PM AI Finance Products 2026 — PM Streak",
    description: "How PMs build AI finance products.",
    url: `${SITE_URL}/pm-ai-finance`,
    type: "article",
  },
};

const DYNAMICS = [
  "Accuracy bar is near-absolute — finance teams don&apos;t forgive hallucinations",
  "Audit trails are product requirements — every AI action must be explainable",
  "Integration with ERP (NetSuite, QuickBooks, Tally) decides adoption",
  "CFO-tech moves slowly but stickily — switching cost is high",
  "AI in close/audit can save 40–60% of time on repetitive tasks",
];

const METRICS = [
  "Hours saved per close cycle",
  "Anomaly detection precision/recall",
  "Forecast variance reduction",
  "Integration depth per customer",
  "Renewal rate at 12+ months",
];

const FAQS = [
  {
    q: "Why is CFO-tech a quiet but big AI opportunity?",
    a: "Because finance teams have massive repetitive work (close, reconciliation, AP, forecast adjustments) that LLMs can accelerate without shipping user-facing risk. Adoption is quieter than flashier categories but revenue per customer is high and churn is low. Ramp, Brex, Pilot all benefit.",
  },
];

export default function PmAiFinancePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Finance", url: `${SITE_URL}/pm-ai-finance` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📈</span> CFO-tech AI is quiet but sticky
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Finance Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for AI finance PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI Finance PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Finance PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
