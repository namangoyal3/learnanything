import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Chat Apps (2026) — WhatsApp, Telegram, iMessage PM Lessons",
  description:
    "How PMs build chat apps. Delivery, encryption, groups, payments on top, and why chat is the stickiest consumer category.",
  keywords: [
    "PM chat apps", "WhatsApp PM",
    "Telegram PM 2026",
  ],
  alternates: { canonical: "/pm-chat-apps" },
  openGraph: {
    title: "PM Chat Apps 2026 — PM Streak",
    description: "How PMs build chat apps.",
    url: `${SITE_URL}/pm-chat-apps`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Chat+Apps+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Chat Apps 2026 — PM Streak",
    description: "How PMs build chat apps.",
    images: [`${SITE_URL}/api/og?title=PM+Chat+Apps+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "Delivery reliability is existential — messages lost kill trust immediately",
  "End-to-end encryption expected by default in 2026",
  "Groups drive network effects — 1:1 chat is easy, groups are sticky",
  "Payments, commerce, communities layered on top diversify revenue",
  "Switching cost is extreme — social graph lives in the app",
];

const METRICS = [
  "Messages sent per DAU",
  "Median delivery latency",
  "Group creation and activity rate",
  "Payment and commerce attach",
  "Retention at 90 days",
];

const FAQS = [
  {
    q: "Can new chat apps still break out in 2026?",
    a: "Almost never in the mass market — WhatsApp, iMessage, Telegram, WeChat dominate. New entrants succeed in niches: creator communities (Discord), gamer communities, privacy-focused audiences (Signal), or enterprise-specific chat (Slack, Teams). Horizontal consumer chat is effectively closed.",
  },
];

export default function PmChatAppsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Chat Apps", url: `${SITE_URL}/pm-chat-apps` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0e1113] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1f2228] border border-[#58cc02]/30 rounded-full px-4 py-1.5 text-sm text-[#89e219] mb-6">
            <span>💬</span> Chat is the stickiest consumer category
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Chat Apps<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for chat app PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#46a302] active:border-b-2 active:translate-y-[2px] text-white font-black px-8 py-3 rounded-2xl transition-all">
            Build Chat App PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Chat App PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
