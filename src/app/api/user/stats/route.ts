import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { checkAndUpdateStreak } from "@/lib/streak";
import {
  CORE_LESSON_WHERE,
  getArchiveUnlockProgressForUser,
  getCoreCurriculumForUser,
  syncArchiveUnlocksForUser,
} from "@/lib/lesson-access";
import { prisma } from "@/lib/prisma";
import {
  catalogEpisodesNotYetImported,
  LENNY_ARCHIVE_CATEGORY_SLUG,
  LENNY_PODCAST_CATALOG_EPISODES,
} from "@/lib/lenny-catalog";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const streakInfo = await checkAndUpdateStreak(userId);

  // Catch up archive unlocks if the user already completed all playable lessons
  // (e.g. unlock logic shipped after they finished the curriculum).
  await syncArchiveUnlocksForUser(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      xp: true,
      level: true,
      streakCount: true,
      longestStreak: true,
      streakFreezes: true,
      gems: true,
    },
  });

  const today = new Date().toISOString().split("T")[0];
  const [curriculum, completedToday, archiveUnlockProgress, coreLessonCount] =
    await Promise.all([
      getCoreCurriculumForUser(userId),
      prisma.completedLesson.count({
        where: {
          userId,
          completedAt: { gte: new Date(today) },
          lesson: { is: CORE_LESSON_WHERE },
        },
      }),
      getArchiveUnlockProgressForUser(userId),
      prisma.lesson.count({
        where: {
          ...CORE_LESSON_WHERE,
          category: { slug: LENNY_ARCHIVE_CATEGORY_SLUG },
        },
      }),
    ]);
  const visibleLessons = curriculum.flatMap((category) => category.lessons);
  const completedCount = visibleLessons.filter((lesson) => lesson.completed).length;
  const totalLessons = visibleLessons.length;
  const totalArchive = LENNY_PODCAST_CATALOG_EPISODES;
  const episodesNotYetImported = catalogEpisodesNotYetImported(coreLessonCount);

  const last30Days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last30Days.push(d.toISOString().split("T")[0]);
  }

  const streakDays = await prisma.streakDay.findMany({
    where: { userId, date: { in: last30Days } },
  });

  const calendar = last30Days.map((date) => {
    const entry = streakDays.find((s) => s.date === date);
    return {
      date,
      completed: entry?.completed ?? false,
      frozen: entry?.frozen ?? false,
    };
  });

  return NextResponse.json({
    user,
    streak: streakInfo,
    completedCount,
    totalLessons,
    completedToday: completedToday > 0,
    totalArchive,
    coreLessonCount,
    episodesNotYetImported,
    archiveUnlockProgress,
    calendar,
  });
}
