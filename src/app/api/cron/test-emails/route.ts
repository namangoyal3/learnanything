import { NextResponse } from "next/server";
import {
  sendWelcomeEmail,
  sendDay2NudgeEmail,
  sendStreakAtRiskEmail,
  sendWeeklyDigestEmail,
  sendChallengeReceivedEmail,
  sendChallengeAcceptedEmail,
} from "@/lib/email";

// One-time test endpoint — sends all email templates to namangoyal21197@gmail.com
export async function GET() {
  const TEST_EMAIL = "namangoyal21197@gmail.com";
  const TEST_NAME = "Naman Goyal";

  await sendWelcomeEmail({ toEmail: TEST_EMAIL, toName: TEST_NAME });
  await new Promise((r) => setTimeout(r, 500));

  await sendDay2NudgeEmail({ toEmail: TEST_EMAIL, toName: TEST_NAME });
  await new Promise((r) => setTimeout(r, 500));

  await sendStreakAtRiskEmail({ toEmail: TEST_EMAIL, toName: TEST_NAME, streakCount: 12 });
  await new Promise((r) => setTimeout(r, 500));

  await sendWeeklyDigestEmail({
    toEmail: TEST_EMAIL,
    toName: TEST_NAME,
    streakCount: 12,
    xp: 340,
    lessonsCompleted: 5,
    friendActivity: [
      { name: "Sarah Chen", lessonsCompleted: 7 },
      { name: "Rahul Mehta", lessonsCompleted: 3 },
    ],
  });
  await new Promise((r) => setTimeout(r, 500));

  await sendChallengeReceivedEmail({
    toEmail: TEST_EMAIL,
    toName: TEST_NAME,
    fromName: "Sarah Chen",
    message: "I challenge you to complete today's lesson! Let's see who's the better PM.",
  });
  await new Promise((r) => setTimeout(r, 500));

  await sendChallengeAcceptedEmail({
    toEmail: TEST_EMAIL,
    toName: TEST_NAME,
    fromName: "Rahul Mehta",
  });

  return NextResponse.json({ ok: true, sent: 6, to: TEST_EMAIL });
}
