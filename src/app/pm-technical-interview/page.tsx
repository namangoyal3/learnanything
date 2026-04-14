import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Technical Interview Questions (2026) — APIs, Data & System Design | PM Streak",
  description:
    "Ace the PM technical interview. APIs, databases, system design for PMs, data pipelines, and how to talk credibly with engineers — with 30+ questions and model answers.",
  keywords: [
    "PM technical interview", "product manager technical interview questions",
    "PM system design interview", "technical questions for product managers",
    "PM API interview", "how technical should a PM be", "PM engineering interview 2026",
  ],
  alternates: { canonical: "/pm-technical-interview" },
  openGraph: {
    title: "PM Technical Interview Questions 2026 — PM Streak",
    description: "APIs, system design, data, and engineering fluency questions for PM interviews.",
    url: `${SITE_URL}/pm-technical-interview`,
    type: "article",
  },
};

const CONCEPTS = [
  {
    concept: "APIs & Integrations",
    icon: "🔌",
    oneLiner: "How software systems talk to each other",
    pmRelevance: "Every feature that touches external services, payments, or third-party data uses APIs. PMs must understand what's possible, what's risky, and what's expensive.",
    questions: [
      "What is a REST API and how is it different from a GraphQL API?",
      "A third-party payment API is returning 429 errors. What does that mean and what would you do?",
      "Your team wants to build a webhook integration. What risks do you surface to engineering?",
      "How would you explain an API rate limit to a business stakeholder?",
    ],
    keyTerms: ["REST", "endpoint", "HTTP status codes (200/400/500)", "rate limiting", "webhook", "authentication (OAuth, API keys)"],
  },
  {
    concept: "Databases & Data",
    icon: "🗄️",
    oneLiner: "How data is stored, queried, and retrieved",
    pmRelevance: "Understanding data models helps you write better PRDs, ask better questions in data reviews, and spot impossible-to-implement requirements early.",
    questions: [
      "Write a SQL query to find users who signed up in the last 30 days but never completed onboarding.",
      "What's the difference between a relational and a NoSQL database? When would you choose each?",
      "A feature requires displaying a user's full order history. Engineering says this will be slow. Why might that be?",
      "How would you design the data schema for a PM practice app with streaks and lessons?",
    ],
    keyTerms: ["SQL (SELECT, WHERE, JOIN, GROUP BY)", "index", "primary key", "relational vs NoSQL", "schema", "query performance"],
  },
  {
    concept: "System Design for PMs",
    icon: "🏗️",
    oneLiner: "How to architect scalable, reliable software at a high level",
    pmRelevance: "PMs don't design systems — but they must understand trade-offs (speed vs consistency, cost vs scale) to make informed scope and prioritisation decisions.",
    questions: [
      "How would you design the backend for a real-time leaderboard that updates every minute for 1M users?",
      "Your feature requires sending 10M push notifications at 9am. What engineering concerns would you raise?",
      "What is a cache, and when does caching cause problems?",
      "Explain load balancing to a non-technical stakeholder in one paragraph.",
    ],
    keyTerms: ["load balancer", "cache", "CDN", "microservices vs monolith", "eventual consistency", "horizontal vs vertical scaling"],
  },
  {
    concept: "Data Pipelines & Analytics",
    icon: "📊",
    oneLiner: "How raw events become the dashboards you make decisions from",
    pmRelevance: "PMs define events, set up funnels, and make product decisions from data. Understanding how data flows from app → warehouse → dashboard prevents bad decisions based on broken pipelines.",
    questions: [
      "What is an event tracking schema and why does it matter for product analytics?",
      "Your retention dashboard shows an unexpected spike. How do you verify if it's real or a tracking issue?",
      "What is the difference between a session and a user in analytics?",
      "Engineering says adding a new event will take 2 sprints. Why might that be?",
    ],
    keyTerms: ["event tracking", "funnel analysis", "data warehouse", "ETL", "session", "A/B test assignment", "Amplitude / Mixpanel"],
  },
];

const FAQS = [
  {
    q: "How technical do you need to be as a product manager?",
    a: "Technical enough to earn engineering credibility — not enough to write production code. You need to understand: what makes something technically complex, how APIs and databases work at a conceptual level, why certain features take longer, and how to evaluate trade-offs. PMs who can ask 'is this a caching problem?' in a data review are dramatically more effective than those who can't.",
  },
  {
    q: "Do all PM interviews have a technical round?",
    a: "No — but companies like Google, Microsoft, Razorpay, and most B2B/infra companies include a technical screen. Even companies without a formal 'technical round' evaluate technical fluency implicitly — through how you talk about system constraints in case studies or how you answer 'what was the hardest technical problem your last product faced?'",
  },
  {
    q: "What SQL level do PMs need to know?",
    a: "Basic to intermediate: SELECT, FROM, WHERE, GROUP BY, ORDER BY, LIMIT, and simple JOINs. You should be able to write a query to find users who did X but not Y in the last N days. Window functions and CTEs are a bonus. The goal isn't writing production-grade SQL — it's being able to self-serve data questions without always needing a data analyst.",
  },
];

export default function PmTechnicalInterviewPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Technical Interview", url: `${SITE_URL}/pm-technical-interview` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>⚙️</span> You don&apos;t need to code — but you need to think like an engineer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Technical Interview<br />Questions (2026)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            APIs, databases, system design, and data pipelines — the technical concepts PMs need
            to know, why they matter, and the questions you&apos;ll be asked about them.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build Technical Fluency Daily — Free →
          </Link>
        </section>

        {/* Concept blocks */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="space-y-8">
            {CONCEPTS.map((c, i) => (
              <div key={c.concept} className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/20 font-bold text-sm">{String(i + 1).padStart(2, "0")}</span>
                      <h2 className="text-lg font-bold text-white">{c.concept}</h2>
                    </div>
                    <p className="text-sm text-white/40">{c.oneLiner}</p>
                  </div>
                </div>
                <div className="bg-[#7c3aed]/5 border border-[#7c3aed]/20 rounded-lg p-3 mb-4 text-sm text-white/70">
                  <span className="text-purple-400 font-medium">Why PMs need this: </span>{c.pmRelevance}
                </div>
                <div className="mb-4">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Interview Questions</p>
                  <ul className="space-y-2">
                    {c.questions.map((q, j) => (
                      <li key={j} className="flex gap-2 text-sm">
                        <span className="text-white/30 flex-shrink-0">{j + 1}.</span>
                        <span className="text-white/70">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-3">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Key Terms to Know</p>
                  <div className="flex flex-wrap gap-2">
                    {c.keyTerms.map((term, j) => (
                      <span key={j} className="text-xs bg-white/5 border border-white/10 rounded-full px-2 py-1 text-white/60">{term}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
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
          <h2 className="text-2xl font-bold mb-3">Build Technical Fluency in 2 Minutes a Day</h2>
          <p className="text-white/60 mb-6">Daily PM lessons that cover technical concepts in plain English — no CS degree required.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
