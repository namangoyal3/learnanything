import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM WhatsApp Business (2026) — Building Conversational Commerce in India | PM Streak",
  description:
    "How PMs build WhatsApp-first products. Conversational commerce, payments, CTWA ads, and why WhatsApp is the dominant consumer surface in India.",
  keywords: [
    "PM WhatsApp business", "conversational commerce",
    "WhatsApp PM india 2026",
  ],
  alternates: { canonical: "/pm-whatsapp-business" },
  openGraph: {
    title: "PM WhatsApp Business 2026 — PM Streak",
    description: "Building conversational commerce on WhatsApp.",
    url: `${SITE_URL}/pm-whatsapp-business`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+WhatsApp+Business+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM WhatsApp Business 2026 — PM Streak",
    description: "Building conversational commerce on WhatsApp.",
    images: [`${SITE_URL}/api/og?title=PM+WhatsApp+Business+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const DYNAMICS = [
  "WhatsApp is the default consumer surface in India — trust it",
  "Click-to-WhatsApp ads bridge Meta ads to conversational commerce",
  "Template messages are rigid but necessary — design around approval friction",
  "Catalogue and payments on WhatsApp enable full funnels",
  "Automation with AI agents reduces support cost dramatically",
];

const METRICS = [
  "Conversation conversion rate (inbound to purchase)",
  "Response time — users expect minutes, not hours",
  "Template approval rate and rejection reasons",
  "Cost per qualified conversation",
  "Handover rate from bot to human",
];

const FAQS = [
  {
    q: "Should Indian D2C brands start with WhatsApp or an app?",
    a: "WhatsApp, almost always. Users already have it, trust it, and transact on it. App installs are expensive and churn fast for most D2C. A WhatsApp-first funnel with CTWA ads, catalogues, and payments can outperform app-based funnels at a fraction of the CAC. Build an app later only if behaviour demands it.",
  },
];

export default function PmWhatsappBusinessPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM WhatsApp Business", url: `${SITE_URL}/pm-whatsapp-business` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>💬</span> WhatsApp is India&apos;s homescreen. Design for it.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM WhatsApp Business<br />(India Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for WhatsApp-first PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build WhatsApp PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice WhatsApp PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
