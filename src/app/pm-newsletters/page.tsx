import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Newsletters (2026) — The Best Substacks for Product Managers | PM Streak",
  description:
    "The PM newsletters worth subscribing to in 2026. Lenny&apos;s, Reforge, Bringing the Donuts, and the Indian PM voices worth following.",
  keywords: [
    "PM newsletters", "Lenny's newsletter 2026",
  ],
  alternates: { canonical: "/pm-newsletters" },
  openGraph: {
    title: "PM Newsletters 2026 — PM Streak",
    description: "Best newsletters for product managers.",
    url: `${SITE_URL}/pm-newsletters`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Newsletters+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Newsletters 2026 — PM Streak",
    description: "Best newsletters for product managers.",
    images: [`${SITE_URL}/api/og?title=PM+Newsletters+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const NEWSLETTERS = [
  { t: "Lenny&apos;s Newsletter", w: "Most popular PM newsletter; deep weekly essays." },
  { t: "Reforge", w: "Growth and product practice, dense and tactical." },
  { t: "Bringing the Donuts (Ken Norton)", w: "Calm wisdom on PM craft and leadership." },
  { t: "Product Hunt Daily", w: "What&apos;s shipping in the consumer world." },
  { t: "Bharat Founders / India PM newsletters", w: "Local context, India-specific PM thinking." },
];

const FAQS = [
  {
    q: "Are PM newsletters worth paid subscriptions?",
    a: "One or two, yes. Lenny&apos;s and Reforge offer enough depth to justify cost for working PMs. Beyond that, free Substacks and your own reading habits compound more. Don&apos;t sub to 10 paid newsletters — you&apos;ll read none thoroughly.",
  },
];

export default function PmNewslettersPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Newsletters", url: `${SITE_URL}/pm-newsletters` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>📬</span> Subscribe to fewer, read deeper
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Newsletters<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 PM newsletters worth following.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Reading Habits — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Newsletters</h2>
          <div className="space-y-3">
            {NEWSLETTERS.map((n, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                <p className="font-semibold text-purple-400 text-sm mb-1">{n.t}</p>
                <p className="text-xs text-white/60">{n.w}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
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
          <h2 className="text-2xl font-bold mb-3">Practice What You Read</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
