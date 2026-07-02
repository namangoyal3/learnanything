import Link from "next/link";
import { Flame } from "lucide-react";

/**
 * Marketing header for logged-out surfaces (SEO pages, /learn, guides).
 * App surfaces use Navbar.tsx; homepage/pricing keep their own inline headers.
 */
export default function MarketingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b-2 border-[var(--border-color)] bg-[var(--bg-primary)]/92 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-5 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-1.5 min-w-0">
          <Flame size={20} className="text-[var(--orange-primary)] shrink-0" />
          <span className="font-black text-lg tracking-tight leading-none">
            <span className="text-[var(--green-primary)]">PM</span>{" "}
            <span className="text-white">Streak</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/learn"
            className="hidden md:inline-flex px-3 py-2 rounded-xl text-xs font-black text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            Guides
          </Link>
          <Link
            href="/pm-interview-cheat-sheet"
            className="hidden md:inline-flex px-3 py-2 rounded-xl text-xs font-black text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            Interview Prep
          </Link>
          <Link
            href="/pricing"
            className="hidden sm:inline-flex px-3 py-2 rounded-xl text-xs font-black text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="hidden sm:inline-flex px-3 py-2 rounded-xl text-xs font-black text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-3 sm:px-4 py-2 rounded-xl bg-[var(--green-primary)] hover:bg-[var(--green-dark)] border-b-4 border-[var(--green-dark)] active:border-b-2 active:translate-y-[2px] text-black text-xs sm:text-sm font-black transition-all"
          >
            Start Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
