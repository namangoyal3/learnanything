import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Resume Guide (2026) — Writing a PM Resume That Gets Interviews",
  description:
    "How PMs write resumes that get past recruiters. Structure, verbs, metrics, and why most PM resumes read the same boring way.",
  keywords: [
    "PM resume guide", "product manager resume",
    "PM CV 2026",
  ],
  alternates: { canonical: "/pm-resume-guide" },
  openGraph: {
    title: "PM Resume Guide 2026 — PM Streak",
    description: "How PMs write resumes that get interviews.",
    url: `${SITE_URL}/pm-resume-guide`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Resume+Guide+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Resume Guide 2026 — PM Streak",
    description: "How PMs write resumes that get interviews.",
    images: [`${SITE_URL}/api/og?title=PM+Resume+Guide+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const PRINCIPLES = [
  "Lead with outcomes, not activities — &apos;Launched X&apos; &lt; &apos;Increased conversion 18%&apos;",
  "Specific metrics — avoid &apos;significantly&apos; and &apos;drove&apos;",
  "Cut fluff — 1-page for under 10 years&apos; experience",
  "Show scope — users affected, revenue, team size",
  "Tailor to the role — same resume for every job loses",
];

const RED_FLAGS = [
  "No numbers in any bullet",
  "Listing responsibilities instead of achievements",
  "Overuse of buzzwords (synergy, agile ninja)",
  "Formatting that doesn&apos;t survive ATS parsing",
];

const FAQS = [
  {
    q: "Should PM resumes include a summary section?",
    a: "Useful for senior PMs (5+ years) and career-switchers; unnecessary for APMs and junior PMs. If you use one, make it 2–3 lines max, focused on most recent impact. Generic summaries (&apos;passionate product manager with 5 years of experience&apos;) add nothing.",
  },
];

export default function PmResumeGuidePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Resume Guide", url: `${SITE_URL}/pm-resume-guide` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📄</span> Outcomes beat activities. Numbers beat adjectives.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Resume Guide<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 principles and 4 red flags for PM resumes.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Resume PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Principles</h2>
          <div className="space-y-2">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Red Flags</h2>
            <div className="space-y-2">
              {RED_FLAGS.map((r, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{r}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Resume Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
