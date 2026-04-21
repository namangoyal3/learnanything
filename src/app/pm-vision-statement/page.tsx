import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { SITE_URL, faqSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "PM Product Vision Guide (2026) — How to Write a Vision That Rallies Teams | PM Streak",
  description:
    "How PMs write a product vision that people actually use. Structure, length, testing it against a team, and examples from great product companies.",
  keywords: [
    "product vision PM", "how to write product vision",
    "product vision template", "PM vision statement",
    "product vision examples 2026",
  ],
  alternates: { canonical: "/pm-vision-statement" },
  openGraph: {
    title: "PM Product Vision Guide 2026 — PM Streak",
    description: "How PMs write product visions that rally teams — structure, examples, tests.",
    url: `${SITE_URL}/pm-vision-statement`,
    images: [{ url: `${SITE_URL}/api/og?title=PM+Product+Vision+Guide+2026++PM+Streak`, width: 1200, height: 630 }],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Product Vision Guide 2026 — PM Streak",
    description: "How PMs write product visions that rally teams — structure, examples, tests.",
    images: [`${SITE_URL}/api/og?title=PM+Product+Vision+Guide+2026++PM+Streak`],
    site: "@pmstreak",
  },
};

const CRITERIA = [
  { test: "Specific enough to guide decisions", why: "Vague visions don&apos;t help anyone decide. &apos;Improve people&apos;s lives&apos; = meaningless." },
  { test: "Ambitious enough to rally people", why: "Visions that are incremental don&apos;t inspire. Great visions sound slightly crazy." },
  { test: "Honest about the trade-off", why: "A vision implies what you&apos;re NOT. &apos;World&apos;s best PM learning for India&apos; = not building for US this year." },
  { test: "Readable in 30 seconds", why: "If someone new on the team can&apos;t summarise it back, it&apos;s too long." },
  { test: "Emotional, not just rational", why: "Vision competes with other priorities for attention. Emotion makes it stickier than logic." },
];

const EXAMPLES = [
  { company: "Duolingo", vision: "&apos;Develop the best education in the world and make it universally available.&apos;" },
  { company: "Airbnb", vision: "&apos;Create a world where anyone can belong anywhere.&apos;" },
  { company: "Stripe", vision: "&apos;Increase the GDP of the internet.&apos;" },
  { company: "Notion", vision: "&apos;Make software toolmakers of everyone.&apos;" },
  { company: "Razorpay", vision: "&apos;Enable financial accessibility for every Indian business.&apos;" },
  { company: "PM Streak (illustrative)", vision: "&apos;Every PM in India has a daily practice habit that compounds into career mastery.&apos;" },
];

const MISTAKES = [
  "Writing a mission, not a vision — missions are present; visions describe a future",
  "Trying to sound profound — most &apos;profound&apos; visions are vague fluff",
  "Updating the vision every year — undermines its purpose as a durable anchor",
  "Too long — anything over 2 sentences gets paraphrased and diluted by the team",
  "Copying another company&apos;s vision — lacks authenticity, team sees through it",
  "Keeping it secret — visions only work when they&apos;re visible everywhere",
];

const TESTS_TO_RUN = [
  "The &apos;bar napkin&apos; test: could you explain it to a stranger in 30 seconds?",
  "The &apos;disagree&apos; test: would someone on your team disagree with it? If no, it&apos;s too generic.",
  "The &apos;6-month test&apos;: would you still agree with it 6 months from now?",
  "The &apos;decision test&apos;: has this vision helped you say no to something recently?",
  "The &apos;paraphrase test&apos;: ask a team member to describe the vision from memory. Match?",
];

const FAQS = [
  {
    q: "Who should write the product vision?",
    a: "The CEO or founder ultimately owns it. For larger products, the senior-most PM on that product line often drafts it — but it&apos;s validated and adopted by leadership. Junior PMs drafting vision for their features is a useful exercise but shouldn&apos;t replace the company-level vision from leadership.",
  },
  {
    q: "How often should the product vision change?",
    a: "Rarely — ideally never. Visions should survive strategy shifts, market changes, even leadership changes. If you&apos;re changing the vision yearly, you don&apos;t have a vision — you have quarterly themes with aspirational phrasing. A healthy vision lives 3–5 years unchanged. Strategy within it changes; the vision doesn&apos;t.",
  },
];

export default function PmVisionStatementPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "PM Product Vision", url: `${SITE_URL}/pm-vision-statement` },
      ])} />
      <JsonLd data={faqSchema(FAQS.map(f => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span>🌅</span> Great visions are specific, ambitious, and impossible to ignore
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            PM Product Vision Guide<br />(2026 Edition)
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            5 criteria for a great vision, 6 real company examples, 6 mistakes to avoid,
            and 5 tests to run before you commit to your vision statement.
          </p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Build PM Strategic Thinking — Free →
          </Link>
        </section>

        {/* Criteria */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-10">5 Criteria for a Great Vision</h2>
          <div className="space-y-3">
            {CRITERIA.map((c, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                <p className="font-semibold text-white text-sm mb-1">{i + 1}. {c.test}</p>
                <p className="text-xs text-white/60">{c.why}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Examples */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">6 Real Vision Examples</h2>
            <div className="space-y-3">
              {EXAMPLES.map((e, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-4">
                  <p className="font-semibold text-purple-400 text-sm mb-1">{e.company}</p>
                  <p className="text-sm text-white/70 italic">&ldquo;{e.vision}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mistakes */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">6 Vision Mistakes</h2>
          <div className="space-y-2">
            {MISTAKES.map((m, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                <span className="text-red-400 flex-shrink-0">❌</span>
                <p className="text-sm text-white/70">{m}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tests */}
        <section className="bg-[#0f0f0f] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10">5 Tests to Run Before Committing</h2>
            <div className="space-y-2">
              {TESTS_TO_RUN.map((t, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-3 flex gap-3">
                  <span className="text-green-400 font-bold flex-shrink-0">{i + 1}.</span>
                  <p className="text-sm text-white/70">{t}</p>
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
          <h2 className="text-2xl font-bold mb-3">Practice PM Vision &amp; Strategy Daily</h2>
          <p className="text-white/60 mb-6">Scenarios that force you to articulate direction, not just tactics.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold px-10 py-3 rounded-xl transition-colors">
            Start Free Trial →
          </Link>
        </section>
      </main>
    </>
  );
}
