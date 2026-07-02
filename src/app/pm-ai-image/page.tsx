import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Image Products (2026) — Midjourney, Stable Diffusion, Adobe Firefly PM Lessons",
  description:
    "How PMs build AI image products. Prompt UX, iteration, safety, rights, and why image is the earliest mature AI creative category.",
  keywords: [
    "PM AI image", "Midjourney PM",
    "Stable Diffusion PM 2026",
  ],
  alternates: { canonical: "/pm-ai-image" },
  openGraph: {
    title: "PM AI Image Products 2026 — PM Streak",
    description: "How PMs build AI image products.",
    url: `${SITE_URL}/pm-ai-image`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+AI+Image+Products+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM AI Image Products 2026 — PM Streak",
    description: "How PMs build AI image products.",
    images: [`${SITE_URL}/api/og?title=PM+AI+Image+Products+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Prompt UX is the product — beginners need templates, pros need control",
  "Iteration loops matter more than single-shot quality",
  "Safety filters need tight tuning — too loose = brand risk, too strict = user frustration",
  "Rights and commercial use are product decisions — source data matters",
  "Professional workflows (layers, masks, editing) extend the ceiling",
];

const METRICS = [
  "Images generated per active user",
  "Acceptance rate (not re-rolled)",
  "Edits per final image (iteration depth)",
  "Commercial plan conversion",
  "Safety flag rate",
];

const FAQS = [
  {
    q: "Why has Midjourney held on against free open-source alternatives?",
    a: "Because product, not just model. Midjourney invested in prompt UX, community (Discord), curation, and aesthetic defaults that feel professional out of the box. Open models are more flexible but require tooling most users won&apos;t build. The model is the ingredient; the product is the meal.",
  },
];

export default function PmAiImagePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Image", url: `${SITE_URL}/pm-ai-image` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎨</span> The model is the ingredient. The product is the meal.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Image Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for AI image product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI Image PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Image PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
