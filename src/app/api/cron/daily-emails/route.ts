import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendStreakAtRiskEmail, sendDay2NudgeEmail, sendWeeklyDigestEmail } from "@/lib/email";
import { getToday, getYesterday } from "@/lib/utils";

// Vercel Cron: runs daily at 6pm UTC (11:30pm IST)
// Secured by CRON_SECRET env var

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = getToday();
  const yesterday = getYesterday();
  const now = new Date();
  const isMonday = now.getUTCDay() === 1;

  // Fetch all active users (active in last 14 days)
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const users = await prisma.user.findMany({
    where: { lastActiveAt: { gte: cutoff } },
    select: {
      id: true,
      email: true,
      name: true,
      streakCount: true,
      xp: true,
      createdAt: true,
      streakHistory: {
        where: { date: today },
        select: { completed: true },
      },
    },
  });

  let nudgeSent = 0;
  let atRiskSent = 0;
  let digestSent = 0;

  for (const user of users) {
    const completedToday = user.streakHistory.length > 0 && user.streakHistory[0].completed;

    if (!completedToday) {
      // Day 2 nudge: signed up yesterday, never completed a lesson
      const signupDate = user.createdAt.toISOString().slice(0, 10);
      if (signupDate === yesterday && user.streakCount === 0) {
        sendDay2NudgeEmail({ toEmail: user.email, toName: user.name }).catch(() => {});
        nudgeSent++;
        continue;
      }

      // Streak at-risk: has an active streak but hasn't learned today
      if (user.streakCount > 0) {
        sendStreakAtRiskEmail({
          toEmail: user.email,
          toName: user.name,
          streakCount: user.streakCount,
        }).catch(() => {});
        atRiskSent++;
      }
    }
  }

  // Weekly digest every Monday
  if (isMonday) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const allUsers = await prisma.user.findMany({
      where: { lastActiveAt: { gte: weekAgo } },
      select: {
        id: true,
        email: true,
        name: true,
        streakCount: true,
        xp: true,
        completedLessons: {
          where: { completedAt: { gte: weekAgo } },
          select: { id: true },
        },
        following: {
          select: {
            following: {
              select: {
                name: true,
                completedLessons: {
                  where: { completedAt: { gte: weekAgo } },
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });

    for (const user of allUsers) {
      const friendActivity = user.following.map((f) => ({
        name: f.following.name,
        lessonsCompleted: f.following.completedLessons.length,
      })).filter((f) => f.lessonsCompleted > 0);

      sendWeeklyDigestEmail({
        toEmail: user.email,
        toName: user.name,
        streakCount: user.streakCount,
        xp: user.xp,
        lessonsCompleted: user.completedLessons.length,
        friendActivity,
      }).catch(() => {});
      digestSent++;
    }
  }

  return NextResponse.json({ nudgeSent, atRiskSent, digestSent, isMonday });
}
