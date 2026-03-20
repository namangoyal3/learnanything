import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const query = req.nextUrl.searchParams.get("q") || "";

  if (query.length < 2) {
    return NextResponse.json({ users: [] });
  }

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: userId } },
        {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
          ],
        },
      ],
    },
    select: {
      id: true,
      name: true,
      xp: true,
      level: true,
      streakCount: true,
      followers: { where: { followerId: userId }, select: { id: true } },
    },
    take: 20,
  });

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      xp: u.xp,
      level: u.level,
      streakCount: u.streakCount,
      isFollowing: u.followers.length > 0,
    })),
  });
}
