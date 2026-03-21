"use client";

import { Flame, BookOpen, Zap } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--green-primary)] to-[var(--green-dark)] flex items-center justify-center shadow-xl shadow-[var(--green-primary)]/30">
              <Flame size={44} className="text-white streak-flame" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Join <span className="text-[var(--green-primary)]">PM</span>
            <span className="text-white"> Streak</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1.5 font-medium">
            Build product skills one streak at a time
          </p>
        </div>

        {/* Value props */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 mb-6 space-y-2.5">
          {[
            { icon: <BookOpen size={15} className="text-[var(--blue-primary)]" />, text: "Learn from Lenny's best PM frameworks" },
            { icon: <Flame size={15} className="text-[var(--orange-primary)]" />, text: "Keep a daily streak to track consistency" },
            { icon: <Zap size={15} className="text-[var(--gold-primary)]" />, text: "Earn XP and climb the leaderboard" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <span className="text-xs font-medium text-[var(--text-secondary)]">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Google Sign-In */}
        <a
          href="/api/auth/google"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-white/5 hover:border-white/20 text-white text-sm font-bold transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </a>

        <p className="text-center mt-6 text-[10px] text-[var(--text-secondary)]/60">
          Powered by insights from Lenny&apos;s Podcast
        </p>
      </div>
    </div>
  );
}
