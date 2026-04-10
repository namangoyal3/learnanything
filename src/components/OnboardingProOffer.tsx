"use client";

import React from 'react';
import { Sparkles, ArrowRight, Zap, Check } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingProOffer() {
  return (
    <div className="rounded-3xl border-2 border-purple-500/50 p-6 bg-gradient-to-br from-purple-900/40 to-purple-800/20 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
        <Sparkles size={32} className="text-purple-400" />
      </div>
      
      <h2 className="text-xl font-bold mb-2">Wait! Accelerate your PM growth?</h2>
      <p className="text-sm text-white/70 mb-6">
        New users who start with <span className="text-purple-400 font-bold">Pro</span> hit their 30-day streak goal <span className="text-white font-bold">4x faster</span>.
      </p>

      <ul className="text-left space-y-3 mb-8">
        {[
          "Unlock 292+ Lenny's Podcast lessons instantly",
          "Unlimited AI lessons and deep dives",
          "AI Interview prep & Jobs Board access",
          "WhatsApp PM Community access"
        ].map((benefit, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-white/80">
            <Check size={14} className="text-purple-400 flex-shrink-0" />
            {benefit}
          </li>
        ))}
      </ul>

      <div className="space-y-3">
        <Link 
          href="/pricing"
          className="w-full py-4 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
        >
          See Pro Plans <Zap size={16} />
        </Link>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
          Special 70% discount applied automatically
        </p>
      </div>
    </div>
  );
}
