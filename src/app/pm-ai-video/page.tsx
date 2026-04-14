import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Video Products (2026) — Sora, Runway, HeyGen PM Lessons | PM Streak",
  description:
    "How PMs build AI video products. Generation vs editing, consistency, length limits, and why AI video is the next wave of creative tooling.",
  keywords: [
    "PM AI video", "Sora PM",
    "Runway PM", "HeyGen PM 2026",
  ],
  alternates: { canonical: "/pm-ai-video" },
  openGraph: {
    title: "PM AI Video Products 2026 — PM Streak",
    description: "How PMs build AI video products.",
    url: `${SITE_URL}/pm-ai-video`,
    type: "article",
  },
};

const DYNAMICS = [
  "Consistency across frames is the hard problem — characters drift mid-shot",
  "Length limits matter — Sora and Runway push past 10s, but cost and coherence fall off",
  "Generation vs editing — two different product shapes, often in one tool",
  "Rights and likeness are legal landmines — avatars need explicit consent",
  "Workflow integration matters for pros — plugins into Premiere, DaVinci",
];

const METRICS = [
  "Seconds of final video produced per user",
  "Re-roll rate (how many attempts before a keeper?)",
  "Upgrade conversion to longer/higher-res tier",
  "Professional workflow integration adoption",
  "Safety incident rate",
];

const FAQS = [
  {
    q: "Will AI video replace traditional video production?",
    a: "For short-form social and advertising, it&apos;s already taking share. For long-form narrative, the ceiling is still meaningfully below human production. Hybrid pipelines (AI for B-roll, motion graphics, previsualisation) are where most production studios land in 2026.",
  },
];

export default function PmAiVideoPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Video", url: `${SITE_URL}/pm-ai-video` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎬</span> Consistency is the hard problem in AI video
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Video Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for AI video product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI Video PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Video PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
