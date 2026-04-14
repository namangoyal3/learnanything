import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Wireframing (2026) — Should PMs Wireframe? | PM Streak",
  description:
    "When PMs should wireframe, when they shouldn&apos;t, and how to wireframe in a way that supports designers rather than replacing them.",
  keywords: [
    "PM wireframing", "PM Figma",
    "low-fidelity wireframes PM 2026",
  ],
  alternates: { canonical: "/pm-wireframing" },
  openGraph: {
    title: "PM Wireframing 2026 — PM Streak",
    description: "When PMs should wireframe, and how to do it right.",
    url: `${SITE_URL}/pm-wireframing`,
    type: "article",
  },
};

const WHEN_TO = [
  "Communicating a rough flow to engineering before design has bandwidth",
  "Pressure-testing your own thinking — if you can&apos;t sketch it, you don&apos;t understand it",
  "Aligning with exec on information architecture before committing design time",
  "Early discovery — wireframes are cheap assumption-tests",
];

const WHEN_NOT_TO = [
  "Pre-deciding design — handing designers finished layouts kills craft and ownership",
  "Client / exec pitches — low-fi wireframes look half-baked to non-practitioners",
  "When you have a designer with bandwidth — just partner from the start",
  "Anything pixel-perfect — stay low-fidelity deliberately",
];

const FAQS = [
  {
    q: "Should PMs learn Figma?",
    a: "Enough to open files, leave comments, and sketch low-fidelity flows. Not enough to design finished screens. The best PMs can navigate Figma fluently but always defer visual and interaction decisions to designers. Tooling fluency is useful; design authorship overreach is a classic anti-pattern.",
  },
];

export default function PmWireframingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Wireframing", url: `${SITE_URL}/pm-wireframing` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🖊️</span> Wireframe to think, not to design
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Wireframing<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            4 situations where PMs should wireframe and 4 where they shouldn&apos;t.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Wireframing PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">When PMs Should Wireframe</h2>
          <div className="space-y-2">
            {WHEN_TO.map((w, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{w}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">When PMs Shouldn&apos;t</h2>
            <div className="space-y-2">
              {WHEN_NOT_TO.map((w, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{w}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Wireframing Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
