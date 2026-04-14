import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Video Editing Tools (2026) — CapCut, Descript, Premiere PM Lessons | PM Streak",
  description:
    "How PMs build video editing tools. Mobile vs desktop, AI assists, templates, and why CapCut disrupted the category by owning creator workflows on mobile.",
  keywords: [
    "PM video editing", "CapCut PM",
    "Descript PM 2026",
  ],
  alternates: { canonical: "/pm-video-editing-tools" },
  openGraph: {
    title: "PM Video Editing Tools 2026 — PM Streak",
    description: "How PMs build video editing tools.",
    url: `${SITE_URL}/pm-video-editing-tools`,
    type: "article",
  },
};

const DYNAMICS = [
  "Mobile-first disrupted desktop — CapCut rewired expectations",
  "AI assists (auto-captions, silence removal, beat matching) are must-haves",
  "Template marketplaces accelerate creator time-to-output",
  "Template-to-pro upgrade path is the monetisation lever",
  "Platform lock-in (TikTok &lt;-&gt; CapCut) shapes distribution",
];

const METRICS = [
  "Videos exported per active user",
  "Template adoption rate",
  "AI feature usage (captions, silence cuts)",
  "Free-to-paid conversion",
  "Session length during active editing",
];

const FAQS = [
  {
    q: "How did CapCut overtake Adobe Premiere among creators?",
    a: "By going mobile-first, free, and TikTok-integrated. Adobe owns the professional market; CapCut owns the billions of mobile creators. When the market shifts to mobile-first creation (TikTok, Reels, Shorts), the product built for that workflow wins — even against a 30-year incumbent.",
  },
];

export default function PmVideoEditingToolsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Video Editing", url: `${SITE_URL}/pm-video-editing-tools` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🎥</span> Mobile-first video editing disrupted a 30-year incumbent
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Video Editing Tools<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for video editing tool PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Video Editing PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Video Editing PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
