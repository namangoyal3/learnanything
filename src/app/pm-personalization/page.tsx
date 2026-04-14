import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Personalization (2026) — Building Products That Adapt to Users | PM Streak",
  description:
    "How PMs design personalization that users trust. Segments vs 1:1, explainability, privacy tradeoffs, and measuring personalisation lift.",
  keywords: [
    "PM personalization", "personalisation PM",
    "1:1 personalization", "adaptive product 2026",
  ],
  alternates: { canonical: "/pm-personalization" },
  openGraph: {
    title: "PM Personalization 2026 — PM Streak",
    description: "How PMs design personalization that users trust.",
    url: `${SITE_URL}/pm-personalization`,
    type: "article",
  },
};

const LEVELS = [
  { l: "Anonymous segments", w: "Geo, device, time-of-day. Cheap, ethical, low lift." },
  { l: "Behavioural segments", w: "Based on observed in-product behaviour. Mid-complexity." },
  { l: "Cohort-based 1:N", w: "Users clustered by shared traits; each cluster gets a variant." },
  { l: "1:1 personalization", w: "ML-driven per-user experience. Highest lift, highest data cost." },
  { l: "User-controlled", w: "User sets preferences explicitly. Transparent but lower engagement." },
];

const TRAPS = [
  "Over-personalisation creates filter bubbles — design for discovery, not just relevance",
  "Hidden personalisation confuses users — show why content is recommended",
  "Privacy debt compounds — don&apos;t collect data you can&apos;t explain",
  "Personalisation &ne; quality — a relevant bad recommendation is still bad",
];

const FAQS = [
  {
    q: "When does personalization pay off vs one-size-fits-all?",
    a: "When you have clear behavioural variance across users, enough data to learn per-user, and the content/product selection is large enough that defaults don&apos;t satisfy everyone. For products with narrow variance or small catalogs, personalisation adds complexity without meaningful lift.",
  },
];

export default function PmPersonalizationPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Personalization", url: `${SITE_URL}/pm-personalization` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🧬</span> Relevance compounds. Creepiness also compounds.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Personalization<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 levels of personalisation and 4 traps to avoid.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Personalization PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Levels</h2>
          <div className="space-y-3">
            {LEVELS.map((l, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                <p className="font-semibold text-purple-400 text-sm mb-1">{l.l}</p>
                <p className="text-xs text-white/60">{l.w}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Traps</h2>
            <div className="space-y-2">
              {TRAPS.map((t, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{t}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Personalization Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
