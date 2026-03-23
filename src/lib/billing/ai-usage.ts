import { prisma } from "@/lib/prisma";

const FREE_DAILY_LIMIT = 1;
const FREE_MONTHLY_LIMIT = 5;
export const FREE_AI_LESSONS_PER_MONTH = FREE_MONTHLY_LIMIT;

export type AiLessonGate =
  | {
      allowed: true;
      usedToday: number;
      usedThisMonth: number;
      limit: number;
      softPaywall: boolean;
    }
  | {
      allowed: false;
      usedToday: number;
      usedThisMonth: number;
      limit: number;
      reason: string;
      type: "daily" | "monthly";
      softPaywall: boolean;
    };

export async function countAiLessonsToday(userId: string): Promise<number> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return prisma.lesson.count({
    where: {
      aiGenerated: true,
      generatedForUserId: userId,
      createdAt: { gte: twentyFourHoursAgo },
    },
  });
}

export async function countAiLessonsThisMonth(userId: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);
  
  return prisma.lesson.count({
    where: {
      aiGenerated: true,
      generatedForUserId: userId,
      createdAt: { gte: startOfMonth },
    },
  });
}

/**
 * Free tier strategy: 1 AI lesson / day.
 * Pro strategy: Unlimited.
 */
export async function evaluateAiLessonGate(
  userId: string,
  isPro: boolean
): Promise<AiLessonGate> {
  const [usedToday, usedThisMonth] = await Promise.all([
    countAiLessonsToday(userId),
    countAiLessonsThisMonth(userId),
  ]);

  if (isPro) {
    return {
      allowed: true,
      usedToday,
      usedThisMonth,
      limit: Infinity,
      softPaywall: false,
    };
  }

  if (usedToday >= FREE_DAILY_LIMIT) {
    return {
      allowed: false,
      usedToday,
      usedThisMonth,
      limit: FREE_DAILY_LIMIT,
      type: "daily",
      softPaywall: false,
      reason: "You've reached your free daily limit for AI lessons. Deep Dives require a deep focus—and Pro access.",
    };
  }

  if (usedThisMonth >= FREE_MONTHLY_LIMIT) {
     return {
      allowed: false,
      usedToday,
      usedThisMonth,
      limit: FREE_MONTHLY_LIMIT,
      type: "monthly",
      softPaywall: false,
      reason: "You've used all 5 free AI lessons for this month. Upgrade to Pro for unlimited deeper insights.",
    };
  }

  return {
    allowed: true,
    usedToday,
    usedThisMonth,
    limit: FREE_DAILY_LIMIT,
    softPaywall: false,
  };
}
