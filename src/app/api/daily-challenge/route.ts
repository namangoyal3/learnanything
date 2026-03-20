import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  let challenge = await prisma.dailyChallenge.findUnique({
    where: { userId_date: { userId, date: today } },
    include: {
      lesson: {
        include: {
          category: true,
          questions: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  if (!challenge) {
    const completedIds = (
      await prisma.completedLesson.findMany({
        where: { userId },
        select: { lessonId: true },
      })
    ).map((c) => c.lessonId);

    let lesson;
    if (completedIds.length > 0) {
      // Pick a random uncompleted lesson, or a random completed one if all done
      lesson = await prisma.lesson.findFirst({
        where: { id: { notIn: completedIds } },
        orderBy: { dayNumber: "asc" },
      });
    }

    if (!lesson) {
      // All completed or none — pick random
      const count = await prisma.lesson.count();
      const skip = Math.floor(Math.random() * count);
      lesson = await prisma.lesson.findFirst({ skip });
    }

    if (!lesson) {
      return NextResponse.json({ error: "No lessons available" }, { status: 404 });
    }

    challenge = await prisma.dailyChallenge.create({
      data: { userId, lessonId: lesson.id, date: today },
      include: {
        lesson: {
          include: {
            category: true,
            questions: { orderBy: { sortOrder: "asc" } },
          },
        },
      },
    });
  }

  return NextResponse.json({
    challenge: {
      id: challenge.id,
      date: challenge.date,
      completed: challenge.completed,
      score: challenge.score,
      xpEarned: challenge.xpEarned,
      lesson: {
        ...challenge.lesson,
        questions: challenge.lesson.questions.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          questionType: q.questionType,
          options: JSON.parse(q.options),
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          xpReward: q.xpReward,
        })),
      },
    },
  });
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { challengeId, score, xpEarned } = await req.json();

  await prisma.dailyChallenge.update({
    where: { id: challengeId },
    data: {
      completed: true,
      score,
      xpEarned,
      completedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
