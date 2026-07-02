import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Music Creation Tools (2026) — Suno, Udio, Ableton PM Lessons",
  description:
    "How PMs build music creation tools. AI composition, DAW integrations, rights, and why AI music creation is reshaping creator economics.",
  keywords: [
    "PM music creation", "Suno PM",
    "Ableton PM 2026",
  ],
  alternates: { canonical: "/pm-music-creation-tools" },
  openGraph: {
    title: "PM Music Creation Tools 2026 — PM Streak",
    description: "How PMs build music creation tools.",
    url: `${SITE_URL}/pm-music-creation-tools`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Music+Creation+Tools+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Music Creation Tools 2026 — PM Streak",
    description: "How PMs build music creation tools.",
    images: [`${SITE_URL}/api/og?title=PM+Music+Creation+Tools+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "AI composition crosses threshold for background music, jingles, hobby tracks",
  "Professional DAW integration still matters for serious creators",
  "Rights and royalty handling are first-class product concerns",
  "Training data licensing is existential — lawsuits pending",
  "Hobby-to-pro transition is where monetisation lives",
];

const METRICS = [
  "Tracks produced per user",
  "Share and download rate",
  "Paid plan conversion",
  "Professional user segment retention",
  "Dispute/claim rate on generated tracks",
];

const FAQS = [
  {
    q: "Will AI music kill the music industry?",
    a: "Parts of it — stock music, background scoring, jingles are already disrupted. Top-of-category artist careers are largely unaffected. Middle-tier session musicians and composers for commercial work face real displacement. The category split mirrors AI disruption elsewhere: commoditised work automates; premium creative work persists.",
  },
];

export default function PmMusicCreationToolsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Music Creation", url: `${SITE_URL}/pm-music-creation-tools` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0e1113] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1f2228] border border-[#58cc02]/30 rounded-full px-4 py-1.5 text-sm text-[#89e219] mb-6">
            <span>🎵</span> AI composition is crossing the threshold for commercial music
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Music Creation Tools<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for music creation tool PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#46a302] active:border-b-2 active:translate-y-[2px] text-white font-black px-8 py-3 rounded-2xl transition-all">
            Build Music Creation PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Dynamics</h2>
          <div className="space-y-2">
            {DYNAMICS.map((d, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-[#89e219] font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#16181c] py-16">
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
          <h2 className="text-2xl font-bold mb-3">Practice Music Creation PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
