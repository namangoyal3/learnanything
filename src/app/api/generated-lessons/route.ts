import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { getGeneratedLessonsForUser } from "@/lib/lesson-access";
import {
  evaluateAiLessonGate,
  FREE_AI_LESSONS_PER_MONTH,
} from "@/lib/billing/ai-usage";
import { isUserPro } from "@/lib/entitlements";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [lessons, isProUser] = await Promise.all([
    getGeneratedLessonsForUser(userId),
    isUserPro(userId),
  ]);
  const gate = await evaluateAiLessonGate(userId, isProUser);

  return NextResponse.json({
    lessons,
    aiUsage: {
      usedToday: gate.usedToday,
      usedThisMonth: gate.usedThisMonth,
      monthlyFreeLimit: isProUser ? null : FREE_AI_LESSONS_PER_MONTH,
      dailyFreeLimit: isProUser ? null : 1,
      remainingDailyCredits: isProUser ? null : Math.max(0, 1 - gate.usedToday),
      unlimited: isProUser,
    },
  });
}
