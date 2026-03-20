import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const FREEZE_COST = 50;

export async function POST() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.gems < FREEZE_COST) {
    return NextResponse.json({ error: "Not enough gems" }, { status: 400 });
  }

  if (user.streakFreezes >= 5) {
    return NextResponse.json({ error: "Max streak freezes reached" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      gems: { decrement: FREEZE_COST },
      streakFreezes: { increment: 1 },
    },
  });

  return NextResponse.json({
    streakFreezes: user.streakFreezes + 1,
    gems: user.gems - FREEZE_COST,
  });
}
