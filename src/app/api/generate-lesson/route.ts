import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { generateLesson } from "@/lib/lesson-generator";

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { topic } = await req.json();
  if (!topic || topic.length < 2) {
    return NextResponse.json({ error: "Topic is required (min 2 chars)" }, { status: 400 });
  }

  try {
    const lesson = await generateLesson(topic, userId);
    return NextResponse.json({ lesson });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to generate lesson: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
