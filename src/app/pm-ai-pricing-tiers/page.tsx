import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Pricing Tiers (2026) — Designing Plans for AI Products | PM Streak",
  description:
    "How PMs design tiers for AI products. Free, Pro, Team, Enterprise — and what each tier should include for AI-first products.",
  keywords: [
    "PM AI pricing tiers", "AI plans 2026",
  ],
  alternates: { canonical: "/pm-ai-pricing-tiers" },
  openGraph: {
    title: "PM AI Pricing Tiers 2026 — PM Streak",
    description: "Designing plans for AI products.",
    url: `${SITE_URL}/pm-ai-pricing-tiers`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+AI+Pricing+Tiers+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM AI Pricing Tiers 2026 — PM Streak",
    description: "Designing plans for AI products.",
    images: [`${SITE_URL}/api/og?title=PM+AI+Pricing+Tiers+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const TIERS = [
  { t: "Free", w: "Limited messages, smaller model. For acquisition." },
  { t: "Pro (~$20/mo)", w: "Latest model, higher limits. The default convert." },
  { t: "Team (~$30/seat/mo)", w: "Shared workspace, admin controls." },
  { t: "Enterprise", w: "SSO, audit logs, dedicated capacity, custom contracts." },
];

const FAQS = [
  {
    q: "Why do most AI products converge to ~$20/month for Pro?",
    a: "Because OpenAI&apos;s ChatGPT Plus set the anchor. $20/month is the price point most users compare against. Pricing significantly higher demands stronger differentiation; pricing lower hurts margin and signals lower quality. The exception: domain-specific AI (legal, medical) prices much higher because the value-per-query justifies it.",
  },
];

export default function PmAiPricingTiersPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Pricing Tiers", url: `${SITE_URL}/pm-ai-pricing-tiers` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>💳</span> $20/mo is the AI Pro anchor. Differentiate or live there.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Pricing Tiers<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            4 tiers and what to put in each.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build AI Pricing PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">4 Tiers</h2>
          <div className="space-y-3">
            {TIERS.map((t, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                <p className="font-semibold text-purple-400 text-sm mb-1">{t.t}</p>
                <p className="text-xs text-white/60">{t.w}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Tier Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
