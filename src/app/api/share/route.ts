import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      xp: true,
      level: true,
      streakCount: true,
      longestStreak: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const completedCount = await prisma.completedLesson.count({ where: { userId } });

  return NextResponse.json({
    card: {
      name: user.name,
      xp: user.xp,
      level: user.level,
      streakCount: user.streakCount,
      longestStreak: user.longestStreak,
      lessonsCompleted: completedCount,
    },
  });
}
