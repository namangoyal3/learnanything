import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Mobile-First Design (2026) — Why India is Still a Mobile-First PM Market",
  description:
    "How PMs build mobile-first for India. Android bias, low-end devices, flaky connectivity, and why desktop-first thinking fails in Bharat.",
  keywords: [
    "PM mobile first", "mobile-first india",
    "Android PM", "Bharat mobile 2026",
  ],
  alternates: { canonical: "/pm-mobile-first" },
  openGraph: {
    title: "PM Mobile-First Design 2026 — PM Streak",
    description: "Why India is still a mobile-first PM market.",
    url: `${SITE_URL}/pm-mobile-first`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Mobile-First+Design+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Mobile-First Design 2026 — PM Streak",
    description: "Why India is still a mobile-first PM market.",
    images: [`${SITE_URL}/api/og?title=PM+Mobile-First+Design+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const REALITIES = [
  "90%+ of Indian internet users are mobile-first or mobile-only",
  "Android dominates at ~95% — design for it, optimise iOS as bonus",
  "Low-end devices (2–3 GB RAM) are the majority, not the long tail",
  "Flaky connectivity is the default — offline-first patterns matter",
  "APK size matters — large apps lose installs at Tier-3 download screens",
];

const PRACTICES = [
  "Test on a 3-year-old Android with 2GB RAM — not on your flagship",
  "Budget for bundle size — every 1MB hurts",
  "Offline-first for critical flows — don&apos;t assume connectivity",
  "Vernacular UX — Hindi, Marathi, Tamil, Telugu, Kannada, Bengali",
  "Minimise form input — numeric keyboards, dropdowns, voice entry",
];

const FAQS = [
  {
    q: "Should Indian startups build web or mobile first?",
    a: "Mobile first, almost always. The addressable market is overwhelmingly mobile-first. Desktop web is a secondary surface for most consumer products. B2B is the main exception — even there, mobile companion apps are increasingly expected. When in doubt, mobile web + PWA is usually a good hedge.",
  },
];

export default function PmMobileFirstPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Mobile-First", url: `${SITE_URL}/pm-mobile-first` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📱</span> India is mobile-first. Design for the device in real hands.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Mobile-First Design<br />(India Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 realities and 5 practices for mobile-first PMs in India.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Mobile-First PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Realities</h2>
          <div className="space-y-2">
            {REALITIES.map((r, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{r}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Practices</h2>
            <div className="space-y-2">
              {PRACTICES.map((p, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{p}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Mobile-First PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
