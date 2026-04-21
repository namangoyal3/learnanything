import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Project Management Tools (2026) — Jira, Linear, Asana PM Guide | PM Streak",
  description:
    "How PMs build project management tools. Views, workflows, notifications, and why adoption follows the path of least resistance.",
  keywords: [
    "PM project management tools", "Jira PM",
    "Linear PM", "Asana PM 2026",
  ],
  alternates: { canonical: "/pm-project-management-tools" },
  openGraph: {
    title: "PM Project Management Tools 2026 — PM Streak",
    description: "How PMs build project management tools.",
    url: `${SITE_URL}/pm-project-management-tools`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Project+Management+Tools+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Project Management Tools 2026 — PM Streak",
    description: "How PMs build project management tools.",
    images: [`${SITE_URL}/api/og?title=PM+Project+Management+Tools+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Flexibility vs opinion — Jira lets you do anything; Linear opinionates you",
  "Views matter more than fields — people live in lists, boards, timelines",
  "Notification hygiene is the product — wrong defaults = ignored tool",
  "Integrations are table stakes — Slack, GitHub, Figma, Zendesk",
  "AI is rewriting triage, grouping, prioritisation",
];

const METRICS = [
  "Daily active users per seat licensed",
  "Tickets created per active user per week",
  "Automations / workflows built per account",
  "Cross-integration adoption rate",
  "Time-to-first-ticket in new workspaces",
];

const FAQS = [
  {
    q: "Why does Linear win against Jira for engineering-led teams?",
    a: "Speed, opinion, and defaults. Linear is fast, makes decisions for you, and has opinionated workflows. Jira is powerful but slow and configurable to a fault — which is what enterprise buyers want and engineering teams resent. Each has its niche.",
  },
];

export default function PmProjectManagementToolsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Project Management Tools", url: `${SITE_URL}/pm-project-management-tools` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📋</span> Adoption follows the path of least resistance
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Project Management Tools<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for project management tool PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Tool PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Project Management Tool Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
