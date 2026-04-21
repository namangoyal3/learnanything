import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Logistics (2026) — Delhivery, Shiprocket, Porter PM Guide | PM Streak",
  description:
    "How PMs build logistics products in India. Last-mile, hub operations, rider economics, and the unique PM challenges of physical-world products.",
  keywords: [
    "PM logistics", "Delhivery PM",
    "Shiprocket PM", "Porter PM", "logistics india 2026",
  ],
  alternates: { canonical: "/pm-logistics" },
  openGraph: {
    title: "PM Logistics 2026 — PM Streak",
    description: "How PMs build logistics products in India — last-mile, hubs, riders.",
    url: `${SITE_URL}/pm-logistics`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Logistics+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Logistics 2026 — PM Streak",
    description: "How PMs build logistics products in India — last-mile, hubs, riders.",
    images: [`${SITE_URL}/api/og?title=PM+Logistics+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Every minute has a cost — time is the hardest constraint in logistics PM",
  "Software eats ops slowly — paper-and-phone workflows coexist with your app",
  "Rider incentives are the real product — bad incentives = bad service",
  "Hub operations are the bottleneck — sort accuracy predicts delivery SLA",
  "Tier-2/3 last-mile is a different game — address quality, payment preferences, trust",
];

const METRICS = [
  "First-attempt delivery rate — p95 matters more than average",
  "Cost per shipment — the lever that decides survival",
  "NDR (non-delivery report) rate and RTO (return to origin) rate",
  "Rider utilisation and earnings — two-sided health check",
  "Customer NPS and seller NPS — you serve both",
];

const QUESTIONS = [
  "Design a feature that reduces NDR rate by 30%",
  "A hub is bleeding money — diagnose from first principles",
  "Design an app experience for riders in Tier-3 cities",
  "How would you price a new express delivery service?",
];

const FAQS = [
  {
    q: "Is logistics PM a good career path?",
    a: "Niche but high-impact. You&apos;ll work on problems that touch physical-world operations, which most software PMs never encounter. Career paths lead to VP Product at logistics companies, ops leadership, or cross-over into e-commerce fulfillment and quick commerce PM roles.",
  },
];

export default function PmLogisticsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Logistics", url: `${SITE_URL}/pm-logistics` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📦</span> Logistics is where software meets physics
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Logistics<br />(India Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics, 5 metrics, and 4 interview-style questions for logistics PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Logistics PM Skills — Free →
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
          <h2 className="text-2xl font-bold text-center mb-10">4 Interview Questions</h2>
          <div className="space-y-2">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-white/30 flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{q}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
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
          <h2 className="text-2xl font-bold mb-3">Practice Logistics PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
