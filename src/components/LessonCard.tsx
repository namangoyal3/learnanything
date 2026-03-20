"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check, Lock, Star, Zap } from "lucide-react";

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  xpReward: number;
  completed: boolean;
  locked: boolean;
  index: number;
}

export default function LessonCard({
  id,
  title,
  description,
  difficulty,
  xpReward,
  completed,
  locked,
  index,
}: LessonCardProps) {
  const colors = [
    "from-[#58cc02] to-[#46a302]",
    "from-[#1cb0f6] to-[#1899d6]",
    "from-[#ff9600] to-[#e08600]",
    "from-[#ce82ff] to-[#b060e0]",
    "from-[#ff4b4b] to-[#ea2b2b]",
  ];

  const colorClass = colors[index % colors.length];

  if (locked) {
    return (
      <div className="lesson-card bg-[var(--bg-card)] rounded-2xl p-4 opacity-50 cursor-not-allowed">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
            <Lock size={20} className="text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate">{title}</h3>
            <p className="text-xs text-[var(--text-secondary)] truncate">{description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/lesson/${id}`}>
      <div className={cn("lesson-card rounded-2xl p-4 bg-gradient-to-br", colorClass)}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            {completed ? (
              <Check size={24} className="text-white" />
            ) : (
              <Star size={24} className="text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-white truncate">{title}</h3>
            <p className="text-xs text-white/80 truncate">{description}</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-white/90 bg-white/20 px-2 py-1 rounded-full">
            <Zap size={12} />
            {xpReward}
          </div>
        </div>
        {completed && (
          <div className="mt-2 text-xs text-white/70 flex items-center gap-1">
            <Check size={14} /> Completed
          </div>
        )}
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full",
                i < difficulty ? "bg-white/60" : "bg-white/20"
              )}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
