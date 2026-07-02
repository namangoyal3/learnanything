import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Subscription Business (2026) — Running a Subscription Product",
  description:
    "How PMs build subscription products. Trial design, annual vs monthly, cancellation flows, and the math that keeps subscription businesses alive.",
  keywords: [
    "PM subscription", "subscription product PM",
    "recurring revenue PM 2026",
  ],
  alternates: { canonical: "/pm-subscription-business" },
  openGraph: {
    title: "PM Subscription Business 2026 — PM Streak",
    description: "How PMs build subscription products.",
    url: `${SITE_URL}/pm-subscription-business`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Subscription+Business+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Subscription Business 2026 — PM Streak",
    description: "How PMs build subscription products.",
    images: [`${SITE_URL}/api/og?title=PM+Subscription+Business+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const LEVERS = [
  "Trial-to-paid conversion — the biggest lever in most subscription products",
  "Annual plan adoption — uplift on LTV, better cash flow",
  "Passive churn (failed cards) — recover with dunning, smart retries",
  "Voluntary churn — reduce with save offers and value reminders",
  "Pricing tier design — good/better/best drives self-selection",
];

const METRICS = [
  "MRR and ARR growth (net of churn)",
  "Trial conversion rate by cohort",
  "Gross and net revenue retention",
  "LTV / CAC — health check of the business",
  "Expansion revenue % — upsell and cross-sell",
];

const FAQS = [
  {
    q: "Free trial vs freemium — which is better?",
    a: "Depends on time-to-value. If users get value fast (days), free trial wins — pressure creates conversion. If value emerges over time (weeks), freemium lets users stick around until they&apos;re ready. B2B often prefers trials; consumer often prefers freemium. Hybrids (free tier + time-limited premium trial) are increasingly common.",
  },
];

export default function PmSubscriptionBusinessPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Subscription Business", url: `${SITE_URL}/pm-subscription-business` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0e1113] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1f2228] border border-[#58cc02]/30 rounded-full px-4 py-1.5 text-sm text-[#89e219] mb-6">
            <span>💳</span> Subscription businesses live or die on renewal math
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Subscription Business<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 levers and 5 metrics for subscription product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#46a302] active:border-b-2 active:translate-y-[2px] text-white font-black px-8 py-3 rounded-2xl transition-all">
            Build Subscription PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Levers</h2>
          <div className="space-y-2">
            {LEVERS.map((l, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-[#89e219] font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{l}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Subscription PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
