import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Mobile vs Web (2026) — Different PM Strategies for Different Platforms | PM Streak",
  description:
    "How PMs think differently about mobile vs web products. User behaviour, distribution, monetisation, engineering — and when to build for which first.",
  keywords: [
    "PM mobile vs web", "mobile PM vs web PM",
    "platform strategy PM", "mobile first india",
    "web vs app PM 2026",
  ],
  alternates: { canonical: "/pm-mobile-vs-web" },
  openGraph: {
    title: "PM Mobile vs Web 2026 — PM Streak",
    description: "How PMs think differently about mobile vs web — user behaviour, distribution, monetisation.",
    url: `${SITE_URL}/pm-mobile-vs-web`,
    type: "article",
  },
};

const DIFFERENCES = [
  { dim: "User context", mobile: "On-the-go, interrupted, short sessions", web: "Desk-bound, focused, long sessions" },
  { dim: "Distribution", mobile: "App store gatekeepers, install friction", web: "SEO / direct, near-zero friction" },
  { dim: "Notifications", mobile: "Push notifications, high-impact channel", web: "Email / in-product only (mostly)" },
  { dim: "Monetisation", mobile: "App store cut (15–30%), subscription dominant", web: "Direct payment, lower cut, ad-friendly" },
  { dim: "Engineering", mobile: "iOS + Android = 2 codebases; slower releases (app store approval)", web: "Single codebase; instant deploys" },
  { dim: "Update velocity", mobile: "Users update apps slowly; legacy version support real", web: "Every user on latest version instantly" },
];

const WHEN_MOBILE_FIRST = [
  "Your target user is mobile-only (most Bharat users)",
  "Use case is inherently mobile (location, camera, offline, always-available)",
  "Push notifications are core to engagement",
  "High session frequency needed (dating, messaging, games)",
  "Payments rely on native mobile wallets (UPI in India)",
];

const WHEN_WEB_FIRST = [
  "Target user is office-bound (B2B SaaS, developer tools)",
  "Use case requires large screen or keyboard (content creation, spreadsheets)",
  "You need fast iteration (web ships instantly; app store takes days)",
  "SEO / content is core to distribution",
  "Ad revenue is monetisation (web enables higher ad density)",
];

const COMMON_MISTAKES = [
  "Copying mobile UX to web 1:1 or vice versa — platform paradigms differ",
  "Launching on both platforms simultaneously without resources — neither excels",
  "Ignoring app store rules — rejections cost weeks",
  "Not respecting update lag — mobile users take weeks to update",
  "Treating mobile as &apos;responsive web&apos; — mobile users expect native patterns",
];

const FAQS = [
  {
    q: "Should startups build mobile-first or web-first in India?",
    a: "For consumer products targeting mass-market: mobile-first, usually Android-first. Most internet users in India are mobile-only. For B2B/SaaS: web-first, mobile as companion app later. Dev tools, content creation, enterprise workflows are web-native. The right answer depends on where your users actually are.",
  },
  {
    q: "What&apos;s the biggest mobile vs web PM mistake?",
    a: "Thinking they&apos;re the same product with different UIs. Mobile users have shorter sessions, rely on notifications, update slowly, and pay through app stores. Web users are the opposite on all dimensions. PMs who ignore these differences build products that feel wrong on one platform.",
  },
];

export default function PmMobileVsWebPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Mobile vs Web", url: `${SITE_URL}/pm-mobile-vs-web` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📱💻</span> Mobile and web are different products, not different interfaces
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Mobile vs Web<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            6-dimension comparison, 5 signs to go mobile-first, 5 signs to go web-first, 5 common mistakes.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Platform Intuition Daily — Free →
          </Link>
        </section>

        {/* Differences */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">6-Dimension Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/40 font-medium">Dimension</th>
                  <th className="text-left py-3 px-4 text-blue-400 font-medium">Mobile</th>
                  <th className="text-left py-3 px-4 text-purple-400 font-medium">Web</th>
                </tr>
              </thead>
              <tbody>
                {DIFFERENCES.map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 px-4 text-white/50 text-xs">{row.dim}</td>
                    <td className="py-3 px-4 text-white/70 text-xs">{row.mobile}</td>
                    <td className="py-3 px-4 text-white/70 text-xs">{row.web}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* When mobile first */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Signs to Go Mobile-First</h2>
            <div className="space-y-2">
              {WHEN_MOBILE_FIRST.map((w, i) => (
                <div key={i} className="bg-[#111] border border-blue-500/20 rounded-xl p-3 flex gap-3">
                  <span className="text-blue-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{w}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* When web first */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Signs to Go Web-First</h2>
          <div className="space-y-2">
            {WHEN_WEB_FIRST.map((w, i) => (
              <div key={i} className="bg-[#111] border border-purple-500/20 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{w}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mistakes */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Common Mistakes</h2>
            <div className="space-y-2">
              {COMMON_MISTAKES.map((m, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
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
          <h2 className="text-2xl font-bold mb-3">Build PM Platform Intuition Daily</h2>
          <p className="text-white/60 mb-6">Daily scenarios on platform strategy, mobile vs web trade-offs, and native patterns.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
