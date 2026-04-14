import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Education Products (2026) — Khanmigo, Duolingo Max, AI Tutors PM Lessons | PM Streak",
  description:
    "How PMs build AI education products. Personalised tutors, safety for minors, outcomes measurement, and why education AI is still waiting for its breakout moment.",
  keywords: [
    "PM AI education", "Khanmigo PM",
    "AI tutor 2026",
  ],
  alternates: { canonical: "/pm-ai-education" },
  openGraph: {
    title: "PM AI Education Products 2026 — PM Streak",
    description: "How PMs build AI education products.",
    url: `${SITE_URL}/pm-ai-education`,
    type: "article",
  },
};

const DYNAMICS = [
  "Outcomes &gt; engagement — prove learning, not session time",
  "Hallucinations in math/science are catastrophic — higher bar than consumer AI",
  "Safety for minors is mandatory — COPPA, DPDP Act, GDPR-K",
  "Teachers and parents are stakeholders, not just students",
  "Distribution in schools requires long, relationship-heavy sales cycles",
];

const METRICS = [
  "Learning outcome lift vs control group",
  "Session engagement per learner",
  "Teacher adoption rate",
  "Parent NPS",
  "Safety incident rate",
];

const FAQS = [
  {
    q: "Why hasn&apos;t AI education exploded as predicted?",
    a: "Because outcomes haven&apos;t been proven rigorously. Schools are institutionally cautious; procurement is slow; parents and teachers are skeptical. Breakouts will come from products that prove measurable learning lift in controlled studies, not just engagement. Khanmigo, Duolingo Max are closest to this proof — not quite there yet.",
  },
];

export default function PmAiEducationPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Education", url: `${SITE_URL}/pm-ai-education` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎓</span> Outcomes beat engagement in education
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Education Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for AI education product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI Education PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Education PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
