"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame, X } from "lucide-react";

interface StreakCelebrationProps {
  milestone: string | null;
  streakCount: number;
  perfectStreak: number;
  onClose: () => void;
}

const MILESTONE_DATA: Record<string, { emoji: string; title: string; message: string; color: string }> = {
  "3-day streak": {
    emoji: "🔥",
    title: "3 Day Streak!",
    message: "You're building momentum. Keep going — day 7 is where the magic happens.",
    color: "from-orange-500 to-red-500",
  },
  "7-day streak": {
    emoji: "⚡",
    title: "7 Day Streak!",
    message: "Research shows this is when habits stick. You're officially in the zone.",
    color: "from-yellow-500 to-orange-500",
  },
  "14-day streak": {
    emoji: "💎",
    title: "14 Day Streak!",
    message: "You're in the top 10% of learners. Two weeks of consistent growth.",
    color: "from-blue-500 to-purple-500",
  },
  "30-day streak": {
    emoji: "👑",
    title: "30 Day Streak!",
    message: "PMs who hit 30 days master 3x more frameworks. You're a PM machine.",
    color: "from-purple-500 to-pink-500",
  },
  "50-day streak": {
    emoji: "🏆",
    title: "50 Day Streak!",
    message: "Only 1% of users reach this level. You're a product legend.",
    color: "from-yellow-400 to-yellow-600",
  },
  "100-day streak": {
    emoji: "🌟",
    title: "100 Day Streak!",
    message: "Triple digits. You've committed to product excellence.",
    color: "from-green-400 to-emerald-600",
  },
  "365-day streak": {
    emoji: "🦉",
    title: "365 Day Streak!",
    message: "A full year. You are now a Streak Society member. Lenny would be proud.",
    color: "from-amber-400 to-amber-600",
  },
};

export default function StreakCelebration({ milestone, streakCount, perfectStreak, onClose }: StreakCelebrationProps) {
  if (!milestone) return null;

  const data = MILESTONE_DATA[milestone] || {
    emoji: "🔥",
    title: `${streakCount}-Day Streak!`,
    message: "Keep the momentum going!",
    color: "from-orange-500 to-red-500",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-full max-w-xs mx-4"
        >
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
           aria-label="Close">
            <X size={16} aria-hidden />
          </button>

          <div className={`bg-gradient-to-br ${data.color} rounded-3xl p-6 text-center shadow-2xl`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-6xl mb-3"
            >
              {data.emoji}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">{data.title}</h2>
              <p className="text-sm text-white/80 mb-4">{data.message}</p>

              {perfectStreak >= 7 && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-white mb-4">
                  <Flame size={12} className="text-yellow-300" /> Perfect Streak: {perfectStreak} days
                </div>
              )}
            </motion.div>

            {/* Confetti particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                }}
                transition={{ duration: 1, delay: 0.1 + i * 0.05 }}
                className="absolute top-1/3 left-1/2 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][i % 6],
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
