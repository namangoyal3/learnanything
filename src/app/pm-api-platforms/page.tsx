import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM API Platforms (2026) — Designing APIs as Product | PM Streak",
  description:
    "How PMs build API platforms. Schema design, versioning, quotas, SDKs, and why API PM is quietly one of the highest-leverage roles in SaaS.",
  keywords: [
    "PM API platforms", "API product manager",
    "API as product 2026",
  ],
  alternates: { canonical: "/pm-api-platforms" },
  openGraph: {
    title: "PM API Platforms 2026 — PM Streak",
    description: "Designing APIs as product.",
    url: `${SITE_URL}/pm-api-platforms`,
    type: "article",
  },
};

const PRINCIPLES = [
  "APIs are forever — design schemas as if you&apos;ll live with them for 10 years",
  "Consistency beats cleverness — predictable naming wins over elegant oddities",
  "Versioning strategy up front — breaking changes are the most expensive bug",
  "Error responses are UX — developers read error messages more than success ones",
  "SDKs compound adoption — a great REST API still wants first-party SDKs",
  "Rate limits should degrade, not fail — give developers headroom",
];

const METRICS = [
  "Active API keys and active developers",
  "Time-to-first-call from signup",
  "P95 latency and error rate",
  "Breaking changes shipped per quarter (lower is better)",
  "SDK adoption share vs raw HTTP",
];

const FAQS = [
  {
    q: "Is API PM different from developer tools PM?",
    a: "Overlap is large but not total. API PMs focus on protocol, schema, and backend surface. Dev tools PMs may also own IDEs, CLIs, dashboards, and docs portals. A strong dev tools PM usually can do API PM; the reverse isn&apos;t always true. Both demand technical fluency and empathy for developers.",
  },
];

export default function PmApiPlatformsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM API Platforms", url: `${SITE_URL}/pm-api-platforms` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🔌</span> APIs are forever. Design them that way.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM API Platforms<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            6 principles and 5 metrics for API platform PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build API PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 Principles</h2>
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
          <h2 className="text-2xl font-bold mb-3">Practice API PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
