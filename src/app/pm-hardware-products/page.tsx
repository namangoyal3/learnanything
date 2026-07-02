import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Hardware Products (2026) — Hardware + Software PM",
  description:
    "How PMs build hardware-enabled products. Long cycles, firmware, supply chain, and why hardware PM is fundamentally different from pure software.",
  keywords: [
    "PM hardware", "IoT PM",
    "hardware product manager 2026",
  ],
  alternates: { canonical: "/pm-hardware-products" },
  openGraph: {
    title: "PM Hardware Products 2026 — PM Streak",
    description: "How PMs build hardware-enabled products.",
    url: `${SITE_URL}/pm-hardware-products`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Hardware+Products+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Hardware Products 2026 — PM Streak",
    description: "How PMs build hardware-enabled products.",
    images: [`${SITE_URL}/api/og?title=PM+Hardware+Products+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const REALITIES = [
  "Long cycles — hardware decisions lock in for years, not sprints",
  "Firmware + app + cloud = 3 release cycles to coordinate",
  "Supply chain is a roadmap constraint — chip shortages shape product decisions",
  "Returns and warranty are first-class — unlike software, you ship atoms",
  "Certifications (FCC, CE, BIS) gate launch — plan 6 months ahead",
];

const METRICS = [
  "Unit economics including COGS and logistics",
  "Return rate and warranty claims",
  "Over-the-air (OTA) update adoption",
  "Active device base vs shipped units",
  "Firmware crash rate / reboot rate",
];

const FAQS = [
  {
    q: "Should software PMs consider hardware?",
    a: "Only if you genuinely enjoy long feedback loops and physical-world constraints. Hardware PM demands patience software PMs aren&apos;t trained for — 18-month cycles, tooling costs, and shipping atoms. The upside: you build things that persist. The downside: mistakes ship on trucks and come back in boxes.",
  },
];

export default function PmHardwareProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Hardware Products", url: `${SITE_URL}/pm-hardware-products` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0e1113] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1f2228] border border-[#58cc02]/30 rounded-full px-4 py-1.5 text-sm text-[#89e219] mb-6">
            <span>🔧</span> Hardware decisions cost years. Plan accordingly.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Hardware Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 realities and 5 metrics for hardware product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#46a302] active:border-b-2 active:translate-y-[2px] text-white font-black px-8 py-3 rounded-2xl transition-all">
            Build Hardware PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Realities</h2>
          <div className="space-y-2">
            {REALITIES.map((r, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-[#89e219] font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{r}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice Hardware PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#58cc02] hover:bg-[#46a302] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
