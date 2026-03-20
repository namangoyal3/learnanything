"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StreakCalendar from "@/components/StreakCalendar";
import XPProgress from "@/components/XPProgress";
import LessonCard from "@/components/LessonCard";
import { Flame, Shield, LogOut, Snowflake, Gem, Calendar, Zap, ArrowRight, Share2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ShareCard from "@/components/ShareCard";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  lessons: {
    id: string;
    title: string;
    slug: string;
    description: string;
    xpReward: number;
    difficulty: number;
    dayNumber: number;
    completed: boolean;
  }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [userRes, statsRes, lessonsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/user/stats"),
          fetch("/api/lessons"),
        ]);

        if (!userRes.ok) {
          router.push("/login");
          return;
        }

        const userData = await userRes.json();
        const statsData = await statsRes.json();
        const lessonsData = await lessonsRes.json();

        setUser(userData.user);
        setStats(statsData);
        setCategories(lessonsData.categories);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "DELETE" });
    router.push("/login");
  };

  const handleBuyFreeze = async () => {
    const res = await fetch("/api/user/streak-freeze", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setUser((u: any) => ({ ...u, streakFreezes: data.streakFreezes, gems: data.gems }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--green-primary)] text-lg font-bold">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navbar streakCount={user.streakCount} xp={user.xp} gems={user.gems} />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Welcome & Streak Banner */}
        {stats?.streak?.streakBroken && (
          <div className="bg-[var(--red-primary)]/10 border border-[var(--red-primary)]/30 rounded-2xl p-4 text-center">
            <p className="text-[var(--red-primary)] font-bold">Your streak was broken!</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Start a new streak today</p>
          </div>
        )}

        <div className="bg-[var(--bg-card)] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">Hey, {user.name}!</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {user.streakCount > 0
                  ? `${user.streakCount} day streak! Keep it going!`
                  : "Start your streak today!"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Flame
                size={36}
                className={cn(
                  "streak-flame",
                  user.streakCount > 0 ? "text-[var(--orange-primary)]" : "text-gray-500"
                )}
              />
              <span className="text-2xl font-bold">{user.streakCount}</span>
            </div>
          </div>
        </div>

        {/* Daily Challenge CTA */}
        <Link href="/daily-challenge">
          <div className="bg-gradient-to-r from-[var(--orange-primary)] to-[var(--red-primary)] rounded-2xl p-4 lesson-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Calendar size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Daily Challenge</div>
                  <div className="text-xs text-white/80 flex items-center gap-1">
                    <Zap size={10} /> Earn bonus XP today
                  </div>
                </div>
              </div>
              <ArrowRight size={20} className="text-white/80" />
            </div>
          </div>
        </Link>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--bg-card)] rounded-2xl p-3 text-center">
            <div className="text-xl font-bold text-[var(--gold-primary)]">{user.xp}</div>
            <div className="text-xs text-[var(--text-secondary)]">Total XP</div>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl p-3 text-center">
            <div className="text-xl font-bold text-[var(--orange-primary)]">{user.longestStreak}</div>
            <div className="text-xs text-[var(--text-secondary)]">Best Streak</div>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl p-3 text-center">
            <div className="text-xl font-bold text-[var(--blue-primary)]">
              {stats?.completedCount ?? 0}/{stats?.totalLessons ?? 0}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">Lessons</div>
          </div>
        </div>

        <XPProgress xp={user.xp} />

        {/* Streak Freeze Shop */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Snowflake size={24} className="text-[var(--blue-primary)]" />
              <div>
                <div className="text-sm font-bold">Streak Freezes: {user.streakFreezes}/5</div>
                <div className="text-xs text-[var(--text-secondary)]">Protect your streak when you miss a day</div>
              </div>
            </div>
            <button
              onClick={handleBuyFreeze}
              disabled={user.gems < 50 || user.streakFreezes >= 5}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--blue-primary)] hover:bg-[var(--blue-dark)] text-white text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Gem size={12} /> 50
            </button>
          </div>
        </div>

        {/* Streak Calendar */}
        {stats?.calendar && <StreakCalendar calendar={stats.calendar} />}

        {/* Lesson Categories */}
        {categories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{category.icon}</span>
              <h2 className="text-lg font-bold">{category.name}</h2>
              <span className="text-xs text-[var(--text-secondary)] ml-auto">
                {category.lessons.filter((l) => l.completed).length}/{category.lessons.length}
              </span>
            </div>
            <div className="space-y-3">
              {category.lessons.map((lesson, i) => {
                const prevCompleted = i === 0 || category.lessons[i - 1].completed;
                return (
                  <LessonCard
                    key={lesson.id}
                    id={lesson.id}
                    title={lesson.title}
                    description={lesson.description}
                    difficulty={lesson.difficulty}
                    xpReward={lesson.xpReward}
                    completed={lesson.completed}
                    locked={!prevCompleted && !lesson.completed}
                    index={i}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Invite Friends */}
        <button
          onClick={() => setShowShare(true)}
          className="w-full py-3 rounded-2xl bg-[var(--purple-primary)] hover:bg-[var(--purple-primary)]/80 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Share2 size={16} /> Invite Friends & Share Streak
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-2xl border-2 border-[var(--border-color)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--red-primary)] transition-colors text-sm flex items-center justify-center gap-2"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </main>

      <ShareCard isOpen={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}
