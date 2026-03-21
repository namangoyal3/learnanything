import { NextResponse } from "next/server";
import {
  sendWelcomeEmail, sendDay2NudgeEmail, sendStreakAtRiskEmail,
  sendWeeklyDigestEmail, sendChallengeReceivedEmail, sendChallengeAcceptedEmail,
} from "@/lib/email";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET() {
  const TO = "namangoyal21197@gmail.com";
  const NAME = "Naman Goyal";

  await sendWelcomeEmail({ toEmail: TO, toName: NAME }); await sleep(1200);
  await sendDay2NudgeEmail({ toEmail: TO, toName: NAME }); await sleep(1200);
  await sendStreakAtRiskEmail({ toEmail: TO, toName: NAME, streakCount: 12 }); await sleep(1200);
  await sendWeeklyDigestEmail({
    toEmail: TO, toName: NAME, streakCount: 12, xp: 340, lessonsCompleted: 5,
    friendActivity: [{ name: "Sarah Chen", lessonsCompleted: 7 }, { name: "Rahul Mehta", lessonsCompleted: 3 }],
  }); await sleep(1200);
  await sendChallengeReceivedEmail({
    toEmail: TO, toName: NAME, fromName: "Sarah Chen",
    message: "I challenge you to complete today's lesson! Let's see who's the better PM.",
  }); await sleep(1200);
  await sendChallengeAcceptedEmail({ toEmail: TO, toName: NAME, fromName: "Rahul Mehta" });

  return NextResponse.json({ ok: true, sent: 6 });
}
