import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Dogfooding Guide (2026) — Why Using Your Own Product Is Non-Negotiable | PM Streak",
  description:
    "Why PMs must use their own product daily, how to dogfood seriously (not for 10 minutes), and why companies with strong dogfooding cultures ship dramatically better products.",
  keywords: [
    "PM dogfooding", "use your own product PM",
    "product manager dogfood", "PM habits 2026",
    "dogfooding culture",
  ],
  alternates: { canonical: "/pm-dogfooding" },
  openGraph: {
    title: "PM Dogfooding Guide 2026 — PM Streak",
    description: "Why dogfooding is non-negotiable for PMs — how to do it seriously, not for 10 minutes.",
    url: `${SITE_URL}/pm-dogfooding`,
    type: "article",
  },
};

const WHY = [
  "You notice friction users won&apos;t bother to report — small annoyances that cost loyalty",
  "You catch bugs before users do — internal users are the cheapest QA",
  "You feel launches emotionally, not just as metrics — builds real empathy",
  "You make sharper product decisions when you live in the product, not just look at dashboards",
  "You build credibility with engineering and design — &apos;I tried this yesterday and it took 12 taps&apos; beats any PRD",
];

const HOW = [
  {
    how: "Use the product for its actual purpose, not as a PM",
    detail: "If you&apos;re a PM at Swiggy, order food from Swiggy 3 nights/week. If you work on Razorpay, set up a payment as a real merchant would.",
  },
  {
    how: "Use it on the devices your users use",
    detail: "Not just on your iPhone 15. Try an Android mid-tier device, try it on 2G, try it with vernacular language setting.",
  },
  {
    how: "Use it in contexts that match real users",
    detail: "Don&apos;t only use it in your office WiFi with full battery. Try it on a crowded metro, in weak signal, when you&apos;re tired." ,
  },
  {
    how: "Use competitors too",
    detail: "You can&apos;t judge your own product without comparison. Use Swiggy AND Zomato. Flipkart AND Meesho. Every week." ,
  },
  {
    how: "Take notes while using",
    detail: "Every friction, every delight, every bug. The patterns across weeks reveal what roadmap reviews don&apos;t." ,
  },
  {
    how: "Share observations with your team",
    detail: "Weekly &apos;dogfooding notes&apos; in Slack signals the practice to the team and catches issues early." ,
  },
];

const COMPANIES_KNOWN_FOR_DOGFOODING = [
  "Duolingo — every employee learns a language on the app",
  "Airbnb — employees stay in Airbnbs on business trips",
  "Slack — the whole company runs on Slack internally",
  "Linear — Linear team uses Linear for their own product dev",
  "Stripe — builds internal products using their own APIs when possible",
];

const ANTI_PATTERNS = [
  "Opening the app for 5 min once a month and calling it dogfooding",
  "Using only the &apos;happy path&apos; features you know work",
  "Never using the product on your personal time — if you don&apos;t use it voluntarily, something&apos;s off",
  "Not using competitors — you can&apos;t diagnose your own product in isolation",
  "Not sharing observations — insights that stay in your head don&apos;t improve the product",
];

const FAQS = [
  {
    q: "What if I don&apos;t naturally care about my product&apos;s space?",
    a: "Serious signal worth reflecting on. PMs who don&apos;t care enough to use their own product rarely ship great products. Short-term you can force yourself to use it; long-term it&apos;s worth asking if this is the right domain for you. Caring about the problem is almost a precondition for PM excellence.",
  },
  {
    q: "How much time should PMs spend dogfooding weekly?",
    a: "2–5 hours of deliberate use, plus whatever organic use your role involves. For consumer products, you should be a real user, not a tourist. For B2B, spend time shadowing actual customers — or become one if you can. PMs who dogfood 5+ hours per week consistently notice issues that PMs who dogfood 1 hour/week miss.",
  },
];

export default function PmDogfoodingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Dogfooding", url: `${SITE_URL}/pm-dogfooding` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🐶</span> You can&apos;t build a great product you wouldn&apos;t use yourself
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Dogfooding Guide<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Why using your own product is non-negotiable, 6 ways to dogfood seriously,
            and 5 companies famous for it.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build User Empathy Daily — Free →
          </Link>
        </section>

        {/* Why */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">Why PMs Must Dogfood</h2>
          <div className="space-y-3">
            {WHY.map((w, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{w}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">6 Ways to Dogfood Seriously</h2>
            <div className="space-y-4">
              {HOW.map((h, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-5">
                  <p className="font-bold text-white mb-1">{i + 1}. {h.how}</p>
                  <p className="text-xs text-white/60">{h.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Known for */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Companies Known for Strong Dogfooding</h2>
          <div className="space-y-2">
            {COMPANIES_KNOWN_FOR_DOGFOODING.map((c, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{c}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Anti-patterns */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Dogfooding Anti-Patterns</h2>
            <div className="space-y-2">
              {ANTI_PATTERNS.map((a, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{a}</p>
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
          <h2 className="text-2xl font-bold mb-3">Build User Empathy Daily</h2>
          <p className="text-white/60 mb-6">Scenarios that force you to think like users — the core dogfooding muscle.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
