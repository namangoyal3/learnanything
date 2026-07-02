import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Senior to Principal (2026) — The Individual Contributor PM Path",
  description:
    "How senior PMs become principal PMs. Scope, judgment, influence, and why the IC path rivals the manager path at top companies.",
  keywords: [
    "PM principal", "senior to principal PM",
    "IC PM path 2026",
  ],
  alternates: { canonical: "/pm-senior-to-principal" },
  openGraph: {
    title: "PM Senior to Principal 2026 — PM Streak",
    description: "The individual contributor PM path.",
    url: `${SITE_URL}/pm-senior-to-principal`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Senior+to+Principal+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Senior to Principal 2026 — PM Streak",
    description: "The individual contributor PM path.",
    images: [`${SITE_URL}/api/og?title=PM+Senior+to+Principal+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const SHIFTS = [
  "From product line ownership to product strategy ownership",
  "From executing on ambiguity to creating clarity for others",
  "From mentoring juniors to shaping the PM discipline",
  "From stakeholder alignment to stakeholder creation (new partnerships, new bets)",
  "From in-the-room authority to written-artifact authority",
];

const SIGNALS = [
  "Principal PMs are the reason a big bet exists, not the operator of it",
  "Their memos shape multi-year strategy",
  "They&apos;re consulted on decisions outside their area",
  "Other PMs learn craft from their work",
  "Their track record includes reversed bets handled with grace",
];

const FAQS = [
  {
    q: "Is the principal PM path viable outside of FAANG?",
    a: "Increasingly yes. Top SaaS companies (Stripe, Figma, Notion, Atlassian) and growth-stage startups have formal IC PM paths. Compensation at principal level is often comparable to director. Pick companies that genuinely value individual-contributor leadership — the path is real there, theoretical elsewhere.",
  },
];

export default function PmSeniorToPrincipalPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Senior to Principal", url: `${SITE_URL}/pm-senior-to-principal` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>⭐</span> Principal PMs are the reason a big bet exists
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Senior to Principal<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 shifts and 5 signals on the path to principal PM.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Principal PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Shifts</h2>
          <div className="space-y-2">
            {SHIFTS.map((s, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{s}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Signals</h2>
            <div className="space-y-2">
              {SIGNALS.map((s, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{s}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Principal PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
