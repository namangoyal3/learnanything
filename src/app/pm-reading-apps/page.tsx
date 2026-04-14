import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Reading Apps (2026) — Kindle, Pratilipi, Readwise PM Lessons | PM Streak",
  description:
    "How PMs build reading apps. Long-form vs short-form, vernacular, subscription, and why Pratilipi rewrote the reading-for-Bharat playbook.",
  keywords: [
    "PM reading apps", "Kindle PM",
    "Pratilipi PM 2026",
  ],
  alternates: { canonical: "/pm-reading-apps" },
  openGraph: {
    title: "PM Reading Apps 2026 — PM Streak",
    description: "How PMs build reading apps.",
    url: `${SITE_URL}/pm-reading-apps`,
    type: "article",
  },
};

const DYNAMICS = [
  "Reading habit is formed in small daily chunks — not long sessions",
  "Vernacular unlocks massive latent demand in India",
  "Short-form serial fiction (Pratilipi, Pocket FM) found a huge audience",
  "Subscription beats per-book pricing for retention at scale",
  "Social reading features (highlights, notes) drive engagement depth",
];

const METRICS = [
  "Daily reading minutes per active user",
  "Completion rate (books/stories finished)",
  "Subscription conversion",
  "Social engagement per reader",
  "Creator earnings on the platform",
];

const FAQS = [
  {
    q: "Why did Pratilipi succeed where other Indian reading apps didn&apos;t?",
    a: "By betting entirely on vernacular creator-driven short-form fiction. They rejected the Kindle model (buy full books) and went with daily serialised reading that fits Indian reading habits. Short chapters, vernacular languages, creator revenue shares — a completely different product shape that worked.",
  },
];

export default function PmReadingAppsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Reading Apps", url: `${SITE_URL}/pm-reading-apps` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📚</span> Reading habits form in small daily chunks
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Reading Apps<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for reading app PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Reading App PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Dynamics</h2>
          <div className="space-y-2">
            {DYNAMICS.map((d, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
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
          <h2 className="text-2xl font-bold mb-3">Practice Reading App Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
