import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM x Customer Success (2026) — Working With CS to Ship the Right Things | PM Streak",
  description:
    "How PMs partner with customer success teams. Feedback loops, escalation handling, and why CS is your richest product-research channel.",
  keywords: [
    "PM customer success", "CS PM partnership",
    "customer success PM 2026",
  ],
  alternates: { canonical: "/pm-customer-success" },
  openGraph: {
    title: "PM x Customer Success 2026 — PM Streak",
    description: "How PMs partner with CS teams to ship the right things.",
    url: `${SITE_URL}/pm-customer-success`,
    type: "article",
  },
};

const PRACTICES = [
  "Weekly CS-PM sync — top themes, top blockers, top wins",
  "Shared escalation doc — PM triages, CS expects response within SLA",
  "Customer advisory group — CS runs, PM attends and listens",
  "Ride-alongs — PM shadows CS on 2 customer calls per month",
  "Feature request triage — PM owns decisions, not CS promises",
];

const SIGNALS = [
  "CSAT / NPS by customer segment",
  "Time-to-value for new customers",
  "Feature-request volume — top requests, trend over time",
  "Escalation rate — issues that hit CS but should have been prevented",
  "Renewal rate and expansion revenue tied to product adoption",
];

const FAQS = [
  {
    q: "Should CS own the roadmap for enterprise customers?",
    a: "No. CS should own advocacy, not ownership. Strong CS teams aggregate feedback, flag urgency, and hold PMs accountable to responses — but the decision on what ships stays with product. When CS owns roadmap, you end up building a frankenstein of one-off customer requests.",
  },
];

export default function PmCustomerSuccessPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM x Customer Success", url: `${SITE_URL}/pm-customer-success` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🤝</span> CS is your richest product-research channel. Most PMs underuse it.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM x Customer Success<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 practices and 5 shared signals for PM-CS partnership.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM-CS Partnership Skills — Free →
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
            <h2 className="text-2xl font-bold text-center mb-10">5 Shared Signals</h2>
            <div className="space-y-2">
              {SIGNALS.map((s, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{s}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice PM-CS Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
