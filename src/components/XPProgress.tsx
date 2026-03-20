"use client";

import { getXPProgress, getLevelFromXP } from "@/lib/utils";

export default function XPProgress({ xp }: { xp: number }) {
  const level = getLevelFromXP(xp);
  const progress = getXPProgress(xp);

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--gold-primary)] flex items-center justify-center font-bold text-sm text-black">
            {level}
          </div>
          <span className="text-sm font-bold">Level {level}</span>
        </div>
        <span className="text-xs text-[var(--text-secondary)]">
          {progress.current}/{progress.needed} XP
        </span>
      </div>
      <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--gold-primary)] rounded-full progress-fill"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  );
}
