import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);

  const friends = await prisma.user.findMany({
    where: { id: { in: followingIds } },
    select: {
      id: true,
      name: true,
      xp: true,
      level: true,
      streakCount: true,
      longestStreak: true,
    },
    orderBy: { xp: "desc" },
  });

  const recentActivity = await prisma.completedLesson.findMany({
    where: { userId: { in: followingIds } },
    include: {
      user: { select: { name: true } },
      lesson: { select: { title: true } },
    },
    orderBy: { completedAt: "desc" },
    take: 20,
  });

  const followerCount = await prisma.follow.count({
    where: { followingId: userId },
  });

  const followingCount = followingIds.length;

  return NextResponse.json({
    friends,
    recentActivity: recentActivity.map((a) => ({
      id: a.id,
      userName: a.user.name,
      lessonTitle: a.lesson.title,
      xpEarned: a.xpEarned,
      completedAt: a.completedAt,
    })),
    followerCount,
    followingCount,
  });
}
