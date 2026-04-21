import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM RAG Products (2026) — Building Retrieval-Augmented Apps | PM Streak",
  description:
    "How PMs build RAG products. Embeddings, chunking, reranking, and why retrieval quality matters more than model choice.",
  keywords: [
    "PM RAG", "retrieval augmented PM 2026",
  ],
  alternates: { canonical: "/pm-rag-products" },
  openGraph: {
    title: "PM RAG Products 2026 — PM Streak",
    description: "Building retrieval-augmented apps.",
    url: `${SITE_URL}/pm-rag-products`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+RAG+Products+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM RAG Products 2026 — PM Streak",
    description: "Building retrieval-augmented apps.",
    images: [`${SITE_URL}/api/og?title=PM+RAG+Products+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const STACK = [
  "Document ingestion and chunking",
  "Embedding model and vector store",
  "Retrieval — semantic search + filters",
  "Reranking — improve top-k quality",
  "LLM synthesis with citations",
];

const PITFALLS = [
  "Bad chunking destroys retrieval quality",
  "Skipping reranking — top-k is rarely best-k",
  "Hallucination from synthesis even when retrieval is correct",
  "No eval set — quality regressions go unnoticed",
];

const FAQS = [
  {
    q: "Should every AI app use RAG?",
    a: "No. RAG fits when answers must come from your data (docs, knowledge base, customer history). For tasks the base model already knows (general writing, code), RAG adds latency and complexity without quality lift. Use RAG where grounding matters; skip it where it doesn&apos;t.",
  },
];

export default function PmRagProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM RAG Products", url: `${SITE_URL}/pm-rag-products` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🔍</span> Retrieval quality &gt; model quality for most RAG apps
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM RAG Products<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 stack layers and 4 pitfalls for RAG product PMs.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build RAG PM Skills — Free →
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Stack Layers</h2>
          <div className="space-y-2">
            {STACK.map((s, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-purple-400 font-bold flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-white/70">{s}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">4 Pitfalls</h2>
            <div className="space-y-2">
              {PITFALLS.map((p, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-red-400 flex-shrink-0">❌</span>
                  <p className="text-sm text-white/70">{p}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice RAG PM Scenarios</h2>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
