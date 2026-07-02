import Link from "next/link";
import { Flame } from "lucide-react";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Daily lessons", href: "/signup" },
      { label: "Pricing", href: "/pricing" },
      { label: "PM guides", href: "/learn" },
      { label: "Research", href: "/research" },
    ],
  },
  {
    title: "Interview prep",
    links: [
      { label: "PM interview cheat sheet", href: "/pm-interview-cheat-sheet" },
      { label: "Product sense interview", href: "/product-sense-interview" },
      { label: "Google PM interview", href: "/google-pm-interview" },
      { label: "Behavioral interview", href: "/pm-behavioral-interview" },
    ],
  },
  {
    title: "Popular guides",
    links: [
      { label: "Become a PM", href: "/how-to-become-a-product-manager" },
      { label: "PM resume guide", href: "/product-manager-resume" },
      { label: "PM career path", href: "/product-manager-career-path" },
      { label: "PM salary in India", href: "/product-manager-salary-india" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t-2 border-[var(--border-color)] bg-[var(--bg-secondary)]/40 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-5 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-3">
              <Flame size={18} className="text-[var(--orange-primary)]" />
              <span className="font-black text-base tracking-tight">
                <span className="text-[var(--green-primary)]">PM</span>{" "}
                <span className="text-white">Streak</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-[24ch]">
              Daily 2-minute PM lessons from 300+ expert interviews. Built for
              product managers, by product managers.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] mb-3">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
          <p>© {new Date().getFullYear()} PM Streak · learnanything.pro</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
