import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      category: true,
      questions: { orderBy: { sortOrder: "asc" } },
      completedLessons: {
        where: { userId },
        select: { score: true, xpEarned: true },
      },
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  return NextResponse.json({
    lesson: {
      ...lesson,
      completed: lesson.completedLessons.length > 0,
      previousScore: lesson.completedLessons[0]?.score ?? null,
      questions: lesson.questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType,
        options: JSON.parse(q.options),
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        xpReward: q.xpReward,
      })),
    },
  });
}
