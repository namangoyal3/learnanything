import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type") || "alltime";

  let users;
  if (type === "weekly") {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyXP = await prisma.quizAttempt.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: weekAgo } },
      _sum: { xpEarned: true },
      orderBy: { _sum: { xpEarned: "desc" } },
      take: 50,
    });

    const userIds = weeklyXP.map((w) => w.userId);
    const userDetails = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, level: true, streakCount: true },
    });

    users = weeklyXP.map((w, i) => {
      const detail = userDetails.find((u) => u.id === w.userId);
      return {
        rank: i + 1,
        id: w.userId,
        name: detail?.name ?? "Unknown",
        xp: w._sum.xpEarned ?? 0,
        level: detail?.level ?? 1,
        streakCount: detail?.streakCount ?? 0,
        isCurrentUser: w.userId === userId,
      };
    });
  } else {
    const topUsers = await prisma.user.findMany({
      orderBy: { xp: "desc" },
      take: 50,
      select: { id: true, name: true, xp: true, level: true, streakCount: true },
    });

    users = topUsers.map((u, i) => ({
      rank: i + 1,
      id: u.id,
      name: u.name,
      xp: u.xp,
      level: u.level,
      streakCount: u.streakCount,
      isCurrentUser: u.id === userId,
    }));
  }

  return NextResponse.json({ leaderboard: users });
}
