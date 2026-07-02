import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM AI Meeting Products (2026) — Fireflies, Otter, Read.ai PM Lessons",
  description:
    "How PMs build AI meeting products. Transcription, summarisation, action items, and why meetings are a killer use case for practical AI.",
  keywords: [
    "PM AI meeting", "Fireflies PM",
    "Otter PM", "Read.ai PM 2026",
  ],
  alternates: { canonical: "/pm-ai-meeting" },
  openGraph: {
    title: "PM AI Meeting Products 2026 — PM Streak",
    description: "How PMs build AI meeting products.",
    url: `${SITE_URL}/pm-ai-meeting`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+AI+Meeting+Products+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM AI Meeting Products 2026 — PM Streak",
    description: "How PMs build AI meeting products.",
    images: [`${SITE_URL}/api/og?title=PM+AI+Meeting+Products+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Accuracy of transcription is the floor — below 95%, users lose trust",
  "Summaries should match meeting type — sales ≠ standup ≠ customer call",
  "Action items drive retention — extract them reliably or don&apos;t bother",
  "Consent and recording notification are legal requirements, not nice-to-haves",
  "Zoom, Meet, Teams integrations are table stakes",
];

const METRICS = [
  "Transcription word error rate",
  "Summary usefulness rating",
  "Action item accuracy",
  "Weekly active meeting count per user",
  "Share rate (summaries sent to colleagues)",
];

const FAQS = [
  {
    q: "Is the AI meeting notes market winner-take-all?",
    a: "No, but consolidating. Zoom, Google, and Microsoft built this natively into their platforms, which commoditises basic summaries. Standalone players (Fireflies, Otter) differentiate through cross-platform support, enterprise governance, CRM integrations, and deeper analytics (talk time, sentiment, coaching).",
  },
];

export default function PmAiMeetingPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM AI Meeting", url: `${SITE_URL}/pm-ai-meeting` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0e1113] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1f2228] border border-[#58cc02]/30 rounded-full px-4 py-1.5 text-sm text-[#89e219] mb-6">
            <span>📝</span> Meetings are the killer use case for practical AI
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM AI Meeting Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for AI meeting product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#46a302] active:border-b-2 active:translate-y-[2px] text-black font-black px-8 py-3 rounded-2xl transition-all">
            Build AI Meeting PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Dynamics</h2>
          <div className="space-y-2">
            {DYNAMICS.map((d, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-[#89e219] font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{d}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice AI Meeting PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] text-black font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
