import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Matrimony &amp; Dating (2026) — Shaadi, Bumble, Aisle PM Lessons | PM Streak",
  description:
    "How PMs build matrimony and dating products. Intent signals, trust and safety, cultural context, and why India is its own category.",
  keywords: [
    "PM matrimony", "dating PM",
    "Shaadi PM", "Bumble PM India 2026",
  ],
  alternates: { canonical: "/pm-matrimony-dating" },
  openGraph: {
    title: "PM Matrimony &amp; Dating 2026 — PM Streak",
    description: "How PMs build matrimony and dating products.",
    url: `${SITE_URL}/pm-matrimony-dating`,
    type: "article",
  },
};

const DYNAMICS = [
  "Intent varies — marriage, relationship, casual — products should signal which",
  "Trust and safety is existential — one incident can kill the brand",
  "Family involvement in matrimony — parents and relatives are real users",
  "Cultural context shapes UX — community, caste, religion filters are sensitive but real",
  "Paid conversion higher than most consumer categories — users pay for serious intent",
];

const METRICS = [
  "Quality matches per active user per week",
  "Message-to-meeting conversion rate",
  "Profile completeness score",
  "Report/block rate as T&amp;S signal",
  "Churn after first serious match (success or fatigue)",
];

const FAQS = [
  {
    q: "Why is Indian matrimony/dating its own category?",
    a: "Because intent, family involvement, and cultural context differ fundamentally from Western dating norms. Western dating apps (Tinder, Bumble) work for urban, casual segments. Matrimony platforms (Shaadi, BharatMatrimony, Jeevansathi) serve intent-to-marry audiences. Products that understand this divide win; products that blur them confuse users and burn trust.",
  },
];

export default function PmMatrimonyDatingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Matrimony & Dating", url: `${SITE_URL}/pm-matrimony-dating` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>💞</span> India is its own category. Design for intent and context.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Matrimony &amp; Dating<br />(India Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for matrimony and dating PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Matrimony/Dating PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Matrimony/Dating PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
