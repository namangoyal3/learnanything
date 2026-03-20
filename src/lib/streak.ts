import { prisma } from "./prisma";
import { getToday, getYesterday } from "./utils";

export async function checkAndUpdateStreak(userId: string): Promise<{
  streakCount: number;
  streakBroken: boolean;
  frozenToday: boolean;
}> {
  const today = getToday();
  const yesterday = getYesterday();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const todayEntry = await prisma.streakDay.findUnique({
    where: { userId_date: { userId, date: today } },
  });
  if (todayEntry) {
    return { streakCount: user.streakCount, streakBroken: false, frozenToday: todayEntry.frozen };
  }

  const yesterdayEntry = await prisma.streakDay.findUnique({
    where: { userId_date: { userId, date: yesterday } },
  });

  if (!yesterdayEntry && user.streakCount > 0) {
    if (user.streakFreezes > 0) {
      await prisma.streakDay.create({
        data: { userId, date: yesterday, completed: false, frozen: true },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { streakFreezes: { decrement: 1 } },
      });
      return { streakCount: user.streakCount, streakBroken: false, frozenToday: false };
    }
    await prisma.user.update({
      where: { id: userId },
      data: { streakCount: 0 },
    });
    return { streakCount: 0, streakBroken: true, frozenToday: false };
  }

  return { streakCount: user.streakCount, streakBroken: false, frozenToday: false };
}

export async function recordLessonCompletion(userId: string, xpEarned: number) {
  const today = getToday();

  const existingEntry = await prisma.streakDay.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  if (!existingEntry) {
    await prisma.streakDay.create({
      data: { userId, date: today, completed: true },
    });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const newStreak = existingEntry ? user.streakCount : user.streakCount + 1;
  const newXP = user.xp + xpEarned;
  const newLevel = Math.floor(newXP / 100) + 1;

  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXP,
      level: newLevel,
      streakCount: newStreak,
      longestStreak: Math.max(user.longestStreak, newStreak),
      lastActiveAt: new Date(),
    },
  });

  return { newStreak, newXP, newLevel };
}
