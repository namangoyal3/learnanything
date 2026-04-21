import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM API Products (2026) — Building APIs Developers Love | PM Streak",
  description:
    "How PMs build API products developers love. API design principles, developer experience, pricing, and the craft of API PM.",
  keywords: [
    "PM API products", "API product manager",
    "developer experience API", "API design PM",
    "API PM role 2026",
  ],
  alternates: { canonical: "/pm-api-products" },
  openGraph: {
    title: "PM API Products 2026 — PM Streak",
    description: "How PMs build APIs developers love — design, DX, pricing, craft.",
    url: `${SITE_URL}/pm-api-products`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+API+Products+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM API Products 2026 — PM Streak",
    description: "How PMs build APIs developers love — design, DX, pricing, craft.",
    images: [`${SITE_URL}/api/og?title=PM+API+Products+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DESIGN_PRINCIPLES = [
  "Consistency across endpoints — same patterns everywhere",
  "Predictable naming — developers should guess the endpoint name and be right",
  "Versioning discipline — never break old versions without migration paths",
  "Comprehensive errors — specific error codes, helpful messages",
  "Idempotency — same request twice = same result",
  "Pagination and rate limiting documented — scale from day 1",
];

const DEV_EXPERIENCE = [
  "Time to first API call &lt; 5 minutes — the hello-world test",
  "Docs are search-friendly — developers Google, not browse",
  "Copy-pasteable code samples in 5+ languages",
  "Interactive API explorer — try before you integrate",
  "Webhook / SDK libraries maintained for major languages",
  "Dev community — Slack, forum, Stack Overflow presence",
];

const PRICING_MODELS = [
  { model: "Per-call", when: "Variable usage, pay-as-you-go (Twilio)" },
  { model: "Per-MAU / per-seat", when: "Platform with consistent user base (Auth0)" },
  { model: "Tiered subscription", when: "Predictable usage, multiple feature levels (Stripe)" },
  { model: "Revenue share", when: "Platform processes transactions for users (payment gateways)" },
  { model: "Freemium + paid", when: "Developer tools where free tier drives adoption (OpenAI)" },
];

const TRAPS = [
  "Breaking changes without warning — loses developer trust forever",
  "Complex auth flows — OAuth done badly is worse than API keys",
  "Poor docs — best API in the world fails without great docs",
  "Hidden rate limits — developers hit them in production",
  "Pricing that punishes growth — users scale up, pricing squeezes them out",
];

const FAQS = [
  {
    q: "Is API PM a good career?",
    a: "Yes, especially at infrastructure companies (Stripe, Twilio, Razorpay, Plaid). API PMs develop rare skills (API design, DX, developer empathy) that are valued at any platform company. Career upside is strong. Trade-off: smaller user base, longer feedback loops, less glamorous than consumer PM.",
  },
  {
    q: "What&apos;s the biggest API PM mistake?",
    a: "Treating APIs like internal features. Internal APIs can evolve freely; public APIs are contracts with developers. Breaking changes, poor docs, sudden pricing changes all violate that contract. The discipline: treat every API as a product with external customers, even internal-facing ones that might become external later.",
  },
];

export default function PmApiProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM API Products", url: `${SITE_URL}/pm-api-products` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🔌</span> APIs are products — designed for developers, not just &apos;wired in&apos;
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM API Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            6 API design principles, 6 DX essentials, 5 pricing models, and 5 common traps.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build API PM Skills Daily — Free →
          </Link>
        </section>

        {/* Design principles */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 API Design Principles</h2>
          <div className="space-y-2">
            {DESIGN_PRINCIPLES.map((d, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DX */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">6 Developer Experience Essentials</h2>
            <div className="space-y-2">
              {DEV_EXPERIENCE.map((d, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 API Pricing Models</h2>
          <div className="space-y-3">
            {PRICING_MODELS.map((p, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                <p className="font-semibold text-purple-400 text-sm mb-1">{p.model}</p>
                <p className="text-xs text-white/60">When to use: {p.when}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Traps */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Common Traps</h2>
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
          <h2 className="text-2xl font-bold mb-3">Build API PM Skills Daily</h2>
          <p className="text-white/60 mb-6">Daily scenarios on API design, DX, and platform product work.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
