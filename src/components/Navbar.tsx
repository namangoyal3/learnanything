"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Flame, BookOpen, Trophy, User, Gem } from "lucide-react";

interface NavbarProps {
  streakCount: number;
  xp: number;
  gems: number;
}

export default function Navbar({ streakCount, xp, gems }: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Learn", icon: BookOpen },
    { href: "/leaderboard", label: "Ranks", icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[var(--green-primary)]">PM</span>
          <span>Streak</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <Flame
              size={20}
              className={cn(
                "streak-flame",
                streakCount > 0 ? "text-[var(--orange-primary)]" : "text-gray-500"
              )}
            />
            <span className="font-bold">{streakCount}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-[var(--gold-primary)]">
            <Gem size={18} />
            <span className="font-bold">{gems}</span>
          </div>
          <div className="text-sm text-[var(--blue-primary)] font-bold">{xp} XP</div>
        </div>
      </div>

      <nav className="max-w-2xl mx-auto px-4 flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center py-2 text-xs border-b-2 transition-colors",
                active
                  ? "border-[var(--green-primary)] text-[var(--green-primary)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-white"
              )}
            >
              <Icon size={20} />
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
