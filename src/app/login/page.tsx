"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame size={40} className="text-[var(--orange-primary)] streak-flame" />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="text-[var(--green-primary)]">PM</span> Streak
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-2">
            Daily product wisdom in 2-3 minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border-color)] text-white placeholder:text-[var(--text-secondary)] focus:border-[var(--green-primary)] focus:outline-none text-sm"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border-color)] text-white placeholder:text-[var(--text-secondary)] focus:border-[var(--green-primary)] focus:outline-none text-sm"
            />
          </div>

          {error && (
            <p className="text-[var(--red-primary)] text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
          New here?{" "}
          <Link href="/signup" className="text-[var(--green-primary)] font-bold hover:underline">
            Create account
          </Link>
        </p>

        <div className="mt-8 bg-[var(--bg-card)] rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Flame size={16} className="text-[var(--orange-primary)]" />
              <span>Streaks</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={16} className="text-[var(--gold-primary)]" />
              <span>XP System</span>
            </div>
            <div className="text-[var(--purple-primary)]">Leaderboards</div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            Powered by insights from Lenny&apos;s Podcast
          </p>
        </div>
      </div>
    </div>
  );
}
