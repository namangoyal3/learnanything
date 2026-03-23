import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import {
  evaluateAiLessonGate,
  FREE_AI_LESSONS_PER_MONTH,
} from "@/lib/billing/ai-usage";
import { isUserPro } from "@/lib/entitlements";
import { prisma } from "@/lib/prisma";

function normalizeTopicKey(topic: string) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(the|a|an|and|of|to|for|on|in)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function slugifyTopic(topic: string) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { topic, generationMode, sourceLessonId } = await req.json();
  if (!topic || topic.length < 2) {
    return NextResponse.json({ error: "Topic is required (min 2 chars)" }, { status: 400 });
  }

  const normalizedTopic = topic.trim();
  const topicKey = normalizeTopicKey(normalizedTopic);
  const isPro = await isUserPro(userId);
  const gate = await evaluateAiLessonGate(userId, isPro);

  try {
    const mode = generationMode === "deep_dive" ? "deep_dive" : "explore";
    const resolvedSourceLessonId =
      typeof sourceLessonId === "string" ? sourceLessonId : null;

    const existingLesson = await prisma.lesson.findFirst({
      where: {
        aiGenerated: true,
        generatedForUserId: userId,
        topicKey,
        generationMode: mode,
        sourceLessonId: resolvedSourceLessonId,
      },
      include: {
        category: {
          select: { name: true, icon: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingLesson) {
      return NextResponse.json({
        lesson: existingLesson,
        aiUsage: {
          usedToday: gate.usedToday,
          usedThisMonth: gate.usedThisMonth,
          softPaywall: gate.softPaywall,
          monthlyFreeLimit: isPro ? null : FREE_AI_LESSONS_PER_MONTH,
          dailyFreeLimit: isPro ? null : 1,
          remainingDailyCredits: isPro ? null : Math.max(0, 1 - gate.usedToday),
          unlimited: isPro,
        },
      });
    }

    if (!gate.allowed) {
      return NextResponse.json(
        {
          error: gate.reason,
          paywall: { hard: true },
          aiUsage: {
            usedThisMonth: gate.usedThisMonth,
            limit: gate.limit,
            remainingDailyCredits: isPro ? null : Math.max(0, 1 - gate.usedToday),
          },
        },
        { status: 402 }
      );
    }

    const reusableLesson = await prisma.lesson.findFirst({
      where: {
        aiGenerated: true,
        topicKey,
        generationMode: mode,
      },
      include: {
        questions: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!reusableLesson) {
      return NextResponse.json(
        {
          error:
            "This topic is not ready in the lesson library yet. Try a suggested topic.",
        },
        { status: 404 }
      );
    }

    const maxDay = await prisma.lesson.aggregate({ _max: { dayNumber: true } });
    const clonedLesson = await prisma.lesson.create({
      data: {
        title:
          mode === "deep_dive"
            ? `${normalizedTopic} — Deeper Dive`
            : `${normalizedTopic.charAt(0).toUpperCase() + normalizedTopic.slice(1)} — Custom Lesson`,
        slug: `ai-${slugifyTopic(normalizedTopic).slice(0, 40)}-${mode}-${Date.now()}`,
        description: reusableLesson.description,
        content: reusableLesson.content,
        xpReward: reusableLesson.xpReward,
        difficulty: reusableLesson.difficulty,
        dayNumber: (maxDay._max.dayNumber ?? 22) + 1,
        categoryId: reusableLesson.categoryId,
        guestName: reusableLesson.guestName,
        episodeTitle: reusableLesson.episodeTitle,
        youtubeId: reusableLesson.youtubeId,
        youtubeStart: reusableLesson.youtubeStart,
        youtubeEnd: reusableLesson.youtubeEnd,
        sourceTranscript: reusableLesson.sourceTranscript,
        aiGenerated: true,
        generatedForUserId: userId,
        topicKey,
        generationMode: mode,
        sourceLessonId: resolvedSourceLessonId,
      },
      include: {
        category: {
          select: { name: true, icon: true },
        },
      },
    });

    if (reusableLesson.questions.length > 0) {
      await prisma.question.createMany({
        data: reusableLesson.questions.map((question) => ({
          lessonId: clonedLesson.id,
          questionText: question.questionText,
          questionType: question.questionType,
          options: question.options,
          correctIndex: question.correctIndex,
          explanation: question.explanation,
          xpReward: question.xpReward,
          sortOrder: question.sortOrder,
        })),
      });
    }

    return NextResponse.json({
      lesson: clonedLesson,
      aiUsage: {
        usedToday: gate.usedToday,
        usedThisMonth: gate.usedThisMonth,
        softPaywall: gate.softPaywall,
        monthlyFreeLimit: isPro ? null : FREE_AI_LESSONS_PER_MONTH,
        dailyFreeLimit: isPro ? null : 1,
        remainingDailyCredits: isPro ? null : Math.max(0, 1 - gate.usedToday - 1),
        unlimited: isPro,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to generate lesson: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
