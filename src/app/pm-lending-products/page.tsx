import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Lending Products (2026) — BNPL, Personal Loans, Credit Card PM Guide | PM Streak",
  description:
    "How PMs build lending products in India. Underwriting, BNPL, collections UX, and the RBI regulatory landscape shaping digital lending.",
  keywords: [
    "PM lending", "BNPL PM",
    "personal loan PM", "lending india 2026",
  ],
  alternates: { canonical: "/pm-lending-products" },
  openGraph: {
    title: "PM Lending Products 2026 — PM Streak",
    description: "How PMs build lending products in India.",
    url: `${SITE_URL}/pm-lending-products`,
    type: "article",
  },
};

const DYNAMICS = [
  "Underwriting data beats UX — the product is credit risk, not just flow",
  "Collections is a first-class PM surface — recovery drives unit economics",
  "RBI rules shift the floor — Digital Lending Guidelines reshaped the industry",
  "Credit scoring is bimodal — you either have great data or you don&apos;t",
  "Trust signals matter — NBFC licensing, interest rate transparency, EMI clarity",
];

const METRICS = [
  "Approval rate by segment",
  "NPA (non-performing assets) rate",
  "Cost of acquisition vs lifetime net interest margin",
  "Disbursement time (application to money in account)",
  "Repeat borrower rate",
];

const FAQS = [
  {
    q: "Is BNPL a viable PM category in India post-RBI restrictions?",
    a: "Transformed, not dead. RBI restrictions on prepaid instrument-funded BNPL forced the category to rebuild around regulated lending. Surviving players (LazyPay, Simpl) operate as NBFCs with proper underwriting. The &apos;buy now, pay never&apos; distortion is gone; what remains is credit-enabled checkout which still has legs.",
  },
];

export default function PmLendingProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Lending Products", url: `${SITE_URL}/pm-lending-products` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>💸</span> In lending, underwriting is the product. UX is support.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Lending Products<br />(India Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 dynamics and 5 metrics for lending PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Lending PM Skills — Free →
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
          <h2 className="text-2xl font-bold mb-3">Practice Lending PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
