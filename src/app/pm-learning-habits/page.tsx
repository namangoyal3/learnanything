import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Learning Habits (2026) — How Great PMs Keep Sharpening",
  description:
    "Daily, weekly, and monthly learning habits that compound for PMs. Inputs, reflection, and deliberate skill-building.",
  keywords: [
    "PM learning habits", "PM growth 2026",
  ],
  alternates: { canonical: "/pm-learning-habits" },
  openGraph: {
    title: "PM Learning Habits 2026 — PM Streak",
    description: "How great PMs keep sharpening.",
    url: `${SITE_URL}/pm-learning-habits`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Learning+Habits+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Learning Habits 2026 — PM Streak",
    description: "How great PMs keep sharpening.",
    images: [`${SITE_URL}/api/og?title=PM+Learning+Habits+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DAILY = [
  "10 minutes reading product essays or newsletters",
  "5 minutes reviewing your own decisions",
  "1 user / customer interaction",
];

const WEEKLY = [
  "Weekly journal — what did I ship, what did I learn, what next",
  "One long-form read or podcast on adjacent PM domain",
  "One deep review of a product you use",
];

const MONTHLY = [
  "Retro on bigger bets — what&apos;s working, what isn&apos;t",
  "Update personal narrative doc — what skills am I building?",
  "Refresh roadmap of learning goals",
];

const FAQS = [
  {
    q: "What separates PMs who keep growing from those who plateau?",
    a: "Deliberate practice. Plateaued PMs mistake accumulated experience for skill growth. Growing PMs pick specific weaknesses, work on them, and measure progress. Journaling, retros, and honest self-assessment compound into senior-level craft. Without that loop, 10 years of experience becomes 1 year repeated 10 times.",
  },
];

export default function PmLearningHabitsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Learning Habits", url: `${SITE_URL}/pm-learning-habits` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0e1113] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1f2228] border border-[#58cc02]/30 rounded-full px-4 py-1.5 text-sm text-[#89e219] mb-6">
            <span>🌱</span> 10 years of experience or 1 year repeated 10 times — your habits decide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Learning Habits<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Daily, weekly, monthly habits that compound.
          </p>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#46a302] active:border-b-2 active:translate-y-[2px] text-white font-black px-8 py-3 rounded-2xl transition-all">
            Build PM Learning Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">Daily (3)</h2>
          <div className="space-y-2">
            {DAILY.map((d, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-[#89e219] font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#16181c] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">Weekly (3)</h2>
            <div className="space-y-2">
              {WEEKLY.map((w, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{w}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">Monthly (3)</h2>
          <div className="space-y-2">
            {MONTHLY.map((m, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-[#89e219] font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{m}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice PM Learning Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
