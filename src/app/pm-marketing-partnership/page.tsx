import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM x Marketing (2026) — How PMs Partner With Marketing",
  description:
    "How PMs partner with marketing. Positioning, launch, performance, content — and the tension between shipping and messaging.",
  keywords: [
    "PM marketing partnership", "product marketing PM",
    "PMM PM 2026",
  ],
  alternates: { canonical: "/pm-marketing-partnership" },
  openGraph: {
    title: "PM x Marketing 2026 — PM Streak",
    description: "How PMs partner with marketing.",
    url: `${SITE_URL}/pm-marketing-partnership`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+x+Marketing+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM x Marketing 2026 — PM Streak",
    description: "How PMs partner with marketing.",
    images: [`${SITE_URL}/api/og?title=PM+x+Marketing+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const PRACTICES = [
  "Co-own positioning with PMM — who we&apos;re for, who we&apos;re not",
  "Share roadmap 90 days out — marketing needs runway to plan",
  "Review messaging together — the promise must match the product",
  "Co-draft launch plans — PM owns readiness, marketing owns reach",
  "Post-launch retro — what worked, what messaging landed, what to change",
];

const TENSIONS = [
  "Timeline pressure vs product readiness — marketing wants to launch when the campaign is ready",
  "Simplicity vs completeness — marketing wants a sharp story; PM wants to cover all cases",
  "Feature hype vs honest expectations — over-promising hurts retention",
  "Target audience — PM serves who uses; marketing targets who buys",
];

const FAQS = [
  {
    q: "Who owns positioning — PM or PMM?",
    a: "PMM owns positioning as an artifact. PM owns the product that must deliver on it. In healthy orgs, they co-create. When positioning is handed down without PM input, it drifts from product reality. When positioning is owned solely by PM, it&apos;s usually too internal and not market-facing.",
  },
];

export default function PmMarketingPartnershipPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM x Marketing", url: `${SITE_URL}/pm-marketing-partnership` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📣</span> The best PMs ship both code and clarity
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM x Marketing<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 practices and 4 tensions for PM-marketing partnership.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM-Marketing Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Practices</h2>
          <div className="space-y-2">
            {PRACTICES.map((p, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Tensions</h2>
            <div className="space-y-2">
              {TENSIONS.map((t, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">⚡</span>
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
          <h2 className="text-2xl font-bold mb-3">Practice PM-Marketing Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
