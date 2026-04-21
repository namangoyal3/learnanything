import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Collaboration Tools (2026) — Notion, Figma, Linear PM Playbook | PM Streak",
  description:
    "How PMs build collaboration products. Multiplayer UX, permissions, templates, and why collaboration tools compound through networks of users.",
  keywords: [
    "PM collaboration tools", "Notion PM",
    "Figma PM", "Linear PM 2026",
  ],
  alternates: { canonical: "/pm-collaboration-tools" },
  openGraph: {
    title: "PM Collaboration Tools 2026 — PM Streak",
    description: "How PMs build collaboration products.",
    url: `${SITE_URL}/pm-collaboration-tools`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Collaboration+Tools+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Collaboration Tools 2026 — PM Streak",
    description: "How PMs build collaboration products.",
    images: [`${SITE_URL}/api/og?title=PM+Collaboration+Tools+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Multiplayer is table stakes — real-time cursors, presence, comments",
  "Templates compound — great templates drive acquisition and activation",
  "Permissions are product — not admin afterthought",
  "Network effects within teams — one user invites 5, retention spikes",
  "Performance matters — slow collaboration tools die",
];

const METRICS = [
  "Seats per account expansion curve",
  "Collaboration sessions (documents with &gt;1 editor in 7 days)",
  "Template usage rate",
  "Time-to-second-seat — how fast does a solo user invite someone?",
  "Cross-workspace invitations — viral signal",
];

const FAQS = [
  {
    q: "Why do collaboration tools grow so fast once they cross a threshold?",
    a: "Because every new user invites 2–5 teammates. The growth function is exponential once the base is large enough. Notion, Figma, Linear all hit this inflection around 100k active users. Before that, it looks slow; after that, it compounds. PMs need to keep pushing through the early grind.",
  },
];

export default function PmCollaborationToolsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Collaboration Tools", url: `${SITE_URL}/pm-collaboration-tools` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>👥</span> Collaboration tools compound — one user brings the next five
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Collaboration Tools<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for collaboration product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Collaboration PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Collaboration PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
