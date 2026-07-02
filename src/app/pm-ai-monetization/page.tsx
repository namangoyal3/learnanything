import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Monetization (2026) — How AI Products Actually Make Money",
  description:
    "How PMs price AI products. Per-seat vs usage vs outcome pricing, and which AI categories converge to which models.",
  keywords: [
    "PM AI monetization", "AI pricing 2026",
  ],
  alternates: { canonical: "/pm-ai-monetization" },
  openGraph: {
    title: "PM AI Monetization 2026 — PM Streak",
    description: "How AI products actually make money.",
    url: `${SITE_URL}/pm-ai-monetization`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+AI+Monetization+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM AI Monetization 2026 — PM Streak",
    description: "How AI products actually make money.",
    images: [`${SITE_URL}/api/og?title=PM+AI+Monetization+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const MODELS = [
  { m: "Per-seat", w: "Familiar to enterprise. Misaligned with usage-driven cost." },
  { m: "Usage-based", w: "Tracks cost; can spook buyers worried about runaway bills." },
  { m: "Hybrid (seat + usage)", w: "Best of both. Most enterprise AI ends here." },
  { m: "Outcome-based", w: "Charge per resolved ticket, generated lead. Hard to measure but compelling." },
];

const FAQS = [
  {
    q: "Why is outcome-based pricing more popular for AI than other categories?",
    a: "Because AI&apos;s value is more measurable. Closed support tickets, generated leads, accepted code suggestions — all quantifiable units of value. Outcome pricing aligns vendor and customer; both sides win when AI works. Expect more AI categories to shift this way over 2026–2028.",
  },
];

export default function PmAiMonetizationPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Monetization", url: `${SITE_URL}/pm-ai-monetization` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>💸</span> Outcome pricing aligns vendor and customer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Monetization<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            4 pricing models for AI products.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI Pricing PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">4 Models</h2>
          <div className="space-y-3">
            {MODELS.map((m, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                <p className="font-semibold text-purple-400 text-sm mb-1">{m.m}</p>
                <p className="text-xs text-white/60">{m.w}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Pricing Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
