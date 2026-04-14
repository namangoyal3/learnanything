import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM to Founder (2026) — Making the Jump from PM to Startup Founder | PM Streak",
  description:
    "How PMs become founders. Skill gaps, distribution, sales, and why PM training is only half the founder skillset.",
  keywords: [
    "PM to founder", "PM founder",
    "startup PM 2026",
  ],
  alternates: { canonical: "/pm-to-founder" },
  openGraph: {
    title: "PM to Founder 2026 — PM Streak",
    description: "Making the jump from PM to startup founder.",
    url: `${SITE_URL}/pm-to-founder`,
    type: "article",
  },
};

const STRENGTHS = [
  "Product sense and discovery muscle",
  "Comfort with ambiguity and cross-functional work",
  "Written communication for fundraising and hiring",
  "User research and customer development",
];

const GAPS = [
  "Distribution and sales — PMs rarely own these",
  "Hiring skills — selecting and recruiting early team",
  "Capital allocation — fundraising, runway, dilution",
  "Crisis management — founder-level reputation risk",
];

const FAQS = [
  {
    q: "Are PMs well-prepared to become founders?",
    a: "Partially. The product and customer development half of being a founder is well-trained by PM work. The distribution, sales, hiring, and capital half is rarely exercised. The PMs who succeed as founders either pair with a co-founder strong in these areas, or deliberately build those skills before jumping.",
  },
];

export default function PmToFounderPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM to Founder", url: `${SITE_URL}/pm-to-founder` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🚀</span> PM training covers half the founder job
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM to Founder<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            4 PM strengths and 4 gaps that founders must close.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Founder PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">4 Strengths PMs Bring</h2>
          <div className="space-y-2">
            {STRENGTHS.map((s, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{s}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Gaps to Close</h2>
            <div className="space-y-2">
              {GAPS.map((g, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">⚠️</span>
                  <p className="text-sm text-white/70">{g}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Founder PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
