import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Robotics (2026) — Humanoids, Warehouse Robots, Autonomous Vehicles | PM Streak",
  description:
    "How PMs build AI-powered robotics. Humanoids, warehouse automation, autonomy, and why the gap between demo and reliable deployment is still years.",
  keywords: [
    "PM AI robotics", "humanoid PM",
    "warehouse robotics 2026",
  ],
  alternates: { canonical: "/pm-ai-robotics" },
  openGraph: {
    title: "PM AI Robotics 2026 — PM Streak",
    description: "How PMs build AI-powered robotics.",
    url: `${SITE_URL}/pm-ai-robotics`,
    type: "article",
  },
};

const DYNAMICS = [
  "Demo video to reliable deployment is a 3–5 year gap",
  "Warehouse and logistics robotics are at commercial scale; humanoids are not",
  "Fleet learning compounds — every robot teaches the next",
  "Safety certification is gate to deployment in industrial settings",
  "Tele-operation fallback often bridges reliability gaps",
];

const METRICS = [
  "Uptime and reliability per unit hour",
  "Safety incidents per million operating hours",
  "Time-to-train on new tasks",
  "Fleet learning improvement rate",
  "Payback period per customer",
];

const FAQS = [
  {
    q: "Are humanoid robots actually useful commercially yet?",
    a: "Mostly in structured industrial pilots. Tesla Optimus, Figure, Agility Digit are deploying in limited warehouse scenarios, but general-purpose humanoid work is years away. Short-term: specialised non-humanoid robots (arms, AMRs) win commercially. Long-term: humanoids may generalise.",
  },
];

export default function PmAiRoboticsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Robotics", url: `${SITE_URL}/pm-ai-robotics` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🤖</span> Demos are 3 years ahead of reliable deployment
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Robotics<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for AI robotics PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI Robotics PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Robotics PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
