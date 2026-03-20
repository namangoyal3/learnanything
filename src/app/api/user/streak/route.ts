import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { checkAndUpdateStreak } from "@/lib/streak";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const streakInfo = await checkAndUpdateStreak(userId);
  return NextResponse.json(streakInfo);
}
