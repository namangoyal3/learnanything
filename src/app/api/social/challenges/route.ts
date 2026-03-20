import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const received = await prisma.friendChallenge.findMany({
    where: { challengeeId: userId, status: "pending" },
    include: {
      challenger: { select: { name: true, level: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const sent = await prisma.friendChallenge.findMany({
    where: { challengerId: userId },
    include: {
      challengee: { select: { name: true, level: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ received, sent });
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { challengeeId, message } = await req.json();

  if (!challengeeId || challengeeId === userId) {
    return NextResponse.json({ error: "Invalid challenge target" }, { status: 400 });
  }

  const challenge = await prisma.friendChallenge.create({
    data: {
      challengerId: userId,
      challengeeId,
      message: message || "I challenge you to complete today's lesson!",
      status: "pending",
    },
  });

  return NextResponse.json({ challenge });
}

export async function PATCH(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { challengeId, action } = await req.json();

  const challenge = await prisma.friendChallenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge || challenge.challengeeId !== userId) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  await prisma.friendChallenge.update({
    where: { id: challengeId },
    data: { status: action === "accept" ? "accepted" : "declined" },
  });

  return NextResponse.json({ ok: true });
}
