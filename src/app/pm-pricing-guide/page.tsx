import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Pricing Guide (2026) — How PMs Think About Pricing | PM Streak",
  description:
    "How PMs partner on pricing decisions. Pricing models, packaging, Van Westendorp, willingness-to-pay research, and how to avoid the most common pricing mistakes.",
  keywords: [
    "PM pricing", "product pricing strategy",
    "how PMs set prices", "pricing research PM",
    "SaaS pricing PM 2026",
  ],
  alternates: { canonical: "/pm-pricing-guide" },
  openGraph: {
    title: "PM Pricing Guide 2026 — PM Streak",
    description: "How PMs think about pricing — models, packaging, and willingness-to-pay research.",
    url: `${SITE_URL}/pm-pricing-guide`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Pricing+Guide+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Pricing Guide 2026 — PM Streak",
    description: "How PMs think about pricing — models, packaging, and willingness-to-pay research.",
    images: [`${SITE_URL}/api/og?title=PM+Pricing+Guide+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const MODELS = [
  { model: "Flat rate", what: "Single price for all users. Simple, fast to decide.", bestFor: "Small SMB SaaS, simple consumer products" },
  { model: "Per-seat (per-user)", what: "Price scales with number of users/accounts.", bestFor: "Collaboration tools, workflow apps (Slack, Figma)" },
  { model: "Usage-based", what: "Pay for what you use — API calls, GB stored, transactions.", bestFor: "Infrastructure, APIs, variable-consumption products (Stripe, AWS)" },
  { model: "Tiered (Good/Better/Best)", what: "3 packages with feature differences.", bestFor: "Most SaaS — captures different willingness-to-pay cleanly" },
  { model: "Freemium", what: "Free tier + paid upgrade.", bestFor: "Consumer apps, PLG SaaS where virality matters" },
  { model: "Hybrid", what: "Combinations — e.g., base price + usage overages.", bestFor: "Platforms with mixed use patterns (Twilio, Vercel)" },
];

const PRICING_QUESTIONS = [
  { q: "Who is my primary price-sensitive customer segment?", why: "Different segments have different willingness-to-pay. Design around primary, not average." },
  { q: "What value does the customer receive per unit?", why: "Value metrics (calls made, seats used, bookings generated) align your price with their value." },
  { q: "What are substitutes priced at?", why: "Customers anchor on alternatives. Know your market context." },
  { q: "What&apos;s my gross margin target?", why: "Different business models require different margins. COGS-heavy products can&apos;t price like SaaS." },
  { q: "How does this affect expansion revenue?", why: "Pricing that caps usage too early kills net revenue retention." },
  { q: "What does this signal about positioning?", why: "Price is positioning. ₹1,000 vs ₹10,000 vs ₹100,000 describe different products." },
];

const RESEARCH_METHODS = [
  "Van Westendorp Price Sensitivity Meter — 4 questions that reveal acceptable price range",
  "Willingness-to-pay surveys — direct but people lie about WTP 20–40%",
  "A/B tests on landing page pricing — real behaviour beats survey data",
  "Sales objection analysis — every &apos;too expensive&apos; is data about perceived value",
  "Win/loss interviews — why deals closed or didn&apos;t — often price wasn&apos;t the real reason",
];

const MISTAKES = [
  "Pricing from costs instead of value — leaves money on the table",
  "Too many tiers (&gt;4) — decision paralysis kills conversion",
  "Changing pricing every quarter — erodes trust with existing customers",
  "Ignoring packaging — what&apos;s included matters as much as the price",
  "Optimising only conversion — net revenue retention matters more over time",
  "Free tier too generous — cannibalises upgrade; too stingy — kills acquisition",
];

const FAQS = [
  {
    q: "Who owns pricing at a company — PM or finance?",
    a: "Depends. At startups: PM or founder. At mid-stage: shared — PM owns packaging and tier features, finance/CRO owns actual numbers. At enterprise companies: often a dedicated pricing team. In all cases, PMs who understand pricing partner better with whoever owns it; PMs who don&apos;t often ship features that contradict pricing strategy.",
  },
  {
    q: "How often should PMs revisit pricing?",
    a: "Annual review of structure; quarterly review of packaging (what&apos;s in each tier). Major pricing overhauls every 2–3 years as the product and market evolve. Frequent price changes hurt trust; never changing pricing often leaves revenue on the table. Find the balance based on your market&apos;s expectations.",
  },
];

export default function PmPricingGuidePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Pricing Guide", url: `${SITE_URL}/pm-pricing-guide` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>💰</span> Price is positioning. Price is strategy. Price is a PM conversation.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Pricing Guide<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            6 pricing models with best-fit use cases, 6 questions every PM should ask before pricing decisions,
            5 research methods, and 6 common mistakes.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Pricing Intuition Daily — Free →
          </Link>
        </section>

        {/* Models */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 Pricing Models</h2>
          <div className="space-y-3">
            {MODELS.map((m, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                <p className="font-bold text-white mb-1">{i + 1}. {m.model}</p>
                <p className="text-sm text-white/60 mb-2">{m.what}</p>
                <p className="text-xs text-purple-400">🎯 Best for: <span className="text-white/70">{m.bestFor}</span></p>
              </div>
            ))}
          </div>
        </section>

        {/* Questions */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">6 Questions Before Pricing Decisions</h2>
            <div className="space-y-3">
              {PRICING_QUESTIONS.map((p, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                  <p className="font-semibold text-white text-sm mb-1">{i + 1}. {p.q}</p>
                  <p className="text-xs text-white/60">{p.why}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Research */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Pricing Research Methods</h2>
          <div className="space-y-2">
            {RESEARCH_METHODS.map((r, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{r}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mistakes */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">6 Pricing Mistakes</h2>
            <div className="space-y-2">
              {MISTAKES.map((m, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
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
          <h2 className="text-2xl font-bold mb-3">Build Monetisation Intuition Daily</h2>
          <p className="text-white/60 mb-6">Scenarios on pricing, packaging, and willingness-to-pay trade-offs.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
