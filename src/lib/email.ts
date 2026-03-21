import { Resend } from "resend";

// Lazy init — only instantiated at runtime when API key is present
function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "placeholder");
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://duolingo-for-pms.vercel.app";
const FROM = "PM Streak <onboarding@resend.dev>";
const REPLY_TO = "namangoyal21197@gmail.com";

function footer() {
  return `<p style="color:#555;font-size:12px;margin-top:24px;border-top:1px solid #222;padding-top:16px">PM Streak — Daily PM micro-lessons from Lenny's Podcast<br>Questions? Reply to this email.</p>`;
}

// ── Welcome email — sent immediately on signup ─────────────────────────────
export async function sendWelcomeEmail({
  toEmail,
  toName,
}: {
  toEmail: string;
  toName: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const firstName = toName.split(" ")[0];
  await getResend().emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: toEmail,
    subject: `Welcome to PM Streak, ${firstName}! Here's how to get started 🔥`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#111;color:#fff;border-radius:16px;padding:32px">
        <h1 style="font-size:24px;margin:0 0 4px">Hey ${firstName}! 👋</h1>
        <p style="color:#aaa;margin:0 0 24px">Welcome to PM Streak — 2-3 minutes a day of product management wisdom from Lenny's Podcast.</p>

        <div style="background:#1a1a1a;border-radius:12px;padding:16px;margin-bottom:24px">
          <div style="font-size:12px;font-weight:bold;color:#777;text-transform:uppercase;margin-bottom:12px">How it works</div>
          <div style="margin-bottom:10px;font-size:14px;color:#ccc"><span style="color:#58cc02;font-weight:bold">1.</span> Complete a daily lesson — 2-3 min read + a quiz</div>
          <div style="margin-bottom:10px;font-size:14px;color:#ccc"><span style="color:#58cc02;font-weight:bold">2.</span> Build your streak — miss a day and it resets</div>
          <div style="margin-bottom:10px;font-size:14px;color:#ccc"><span style="color:#58cc02;font-weight:bold">3.</span> Earn XP and gems — challenge friends, climb the leaderboard</div>
          <div style="font-size:14px;color:#ccc"><span style="color:#58cc02;font-weight:bold">4.</span> 7-day streak unlocks Social + Leaderboard</div>
        </div>

        <div style="background:#58cc02/10;border:1px solid #58cc02/30;border-radius:12px;padding:16px;margin-bottom:24px;background:#0a1f0a;border:1px solid #1a4a1a">
          <div style="font-size:13px;color:#58cc02;font-weight:bold;margin-bottom:4px">Your starter pack</div>
          <div style="font-size:13px;color:#aaa">50 gems · 2 streak freezes · Day 1 lesson ready</div>
        </div>

        <a href="${APP_URL}/dashboard" style="display:inline-block;background:#58cc02;color:#fff;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:12px;font-size:15px">
          Start your first lesson →
        </a>
        ${footer()}
      </div>
    `,
  });
}

// ── Day 2 nudge — sent if no lesson completed after 24h ───────────────────
export async function sendDay2NudgeEmail({
  toEmail,
  toName,
}: {
  toEmail: string;
  toName: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const firstName = toName.split(" ")[0];
  await getResend().emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: toEmail,
    subject: `${firstName}, your streak hasn't started yet 👀`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#111;color:#fff;border-radius:16px;padding:32px">
        <h1 style="font-size:24px;margin:0 0 8px">Your streak is waiting ⏳</h1>
        <p style="color:#aaa;margin:0 0 16px">You signed up for PM Streak but haven't completed your first lesson yet.</p>
        <p style="color:#ccc;font-size:14px;margin:0 0 24px">The first lesson takes 2-3 minutes and covers a real insight from Lenny's Podcast. It's the easiest streak day you'll ever have.</p>
        <a href="${APP_URL}/dashboard" style="display:inline-block;background:#58cc02;color:#fff;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:12px;font-size:15px">
          Complete lesson 1 now →
        </a>
        ${footer()}
      </div>
    `,
  });
}

// ── Streak at-risk — sent when user hasn't learned today ──────────────────
export async function sendStreakAtRiskEmail({
  toEmail,
  toName,
  streakCount,
}: {
  toEmail: string;
  toName: string;
  streakCount: number;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const firstName = toName.split(" ")[0];
  const isLong = streakCount >= 7;
  await getResend().emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: toEmail,
    subject: isLong
      ? `Your ${streakCount}-day streak ends in a few hours 😬`
      : `Don't break your streak, ${firstName}!`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#111;color:#fff;border-radius:16px;padding:32px">
        <h1 style="font-size:24px;margin:0 0 8px">${isLong ? `${streakCount} days on the line 🔥` : "Your streak needs you 🔥"}</h1>
        <p style="color:#aaa;margin:0 0 16px">
          ${isLong
            ? `You've built a ${streakCount}-day learning streak. Don't let it reset tonight — it only takes 2 minutes.`
            : `You're building a PM learning habit. Miss today and you'll have to start over.`}
        </p>
        <a href="${APP_URL}/dashboard" style="display:inline-block;background:#ff9600;color:#fff;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:12px;font-size:15px">
          Keep my streak alive →
        </a>
        ${footer()}
      </div>
    `,
  });
}

// ── Weekly digest — sent every Monday ─────────────────────────────────────
export async function sendWeeklyDigestEmail({
  toEmail,
  toName,
  streakCount,
  xp,
  lessonsCompleted,
  friendActivity,
}: {
  toEmail: string;
  toName: string;
  streakCount: number;
  xp: number;
  lessonsCompleted: number;
  friendActivity: { name: string; lessonsCompleted: number }[];
}) {
  if (!process.env.RESEND_API_KEY) return;
  const firstName = toName.split(" ")[0];
  const friendRows = friendActivity
    .slice(0, 3)
    .map(
      (f) =>
        `<tr><td style="padding:6px 0;color:#ccc">${f.name}</td><td style="padding:6px 0;color:#58cc02;font-weight:bold;text-align:right">${f.lessonsCompleted} lessons</td></tr>`
    )
    .join("");

  await getResend().emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: toEmail,
    subject: `Your weekly PM Streak update 🔥`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#111;color:#fff;border-radius:16px;padding:32px">
        <h1 style="font-size:22px;margin:0 0 4px">Hey ${firstName}! 👋</h1>
        <p style="color:#aaa;margin:0 0 24px">Here's your PM Streak update for this week.</p>

        <div style="display:flex;gap:12px;margin-bottom:24px">
          <div style="flex:1;background:#1a1a1a;border-radius:12px;padding:12px;text-align:center">
            <div style="font-size:22px;font-weight:bold;color:#ff9600">${streakCount}</div>
            <div style="font-size:11px;color:#777">Day Streak</div>
          </div>
          <div style="flex:1;background:#1a1a1a;border-radius:12px;padding:12px;text-align:center">
            <div style="font-size:22px;font-weight:bold;color:#ffd700">${xp}</div>
            <div style="font-size:11px;color:#777">Total XP</div>
          </div>
          <div style="flex:1;background:#1a1a1a;border-radius:12px;padding:12px;text-align:center">
            <div style="font-size:22px;font-weight:bold;color:#58cc02">${lessonsCompleted}</div>
            <div style="font-size:11px;color:#777">This Week</div>
          </div>
        </div>

        ${friendRows ? `<div style="background:#1a1a1a;border-radius:12px;padding:16px;margin-bottom:24px">
          <div style="font-size:12px;font-weight:bold;color:#777;text-transform:uppercase;margin-bottom:8px">Friends this week</div>
          <table style="width:100%;border-collapse:collapse">${friendRows}</table>
        </div>` : ""}

        <a href="${APP_URL}/dashboard" style="display:inline-block;background:#58cc02;color:#fff;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:12px;font-size:15px">
          Keep your streak alive →
        </a>
        ${footer()}
      </div>
    `,
  });
}

// ── Challenge emails ───────────────────────────────────────────────────────
export async function sendChallengeReceivedEmail({
  toEmail,
  toName,
  fromName,
  message,
}: {
  toEmail: string;
  toName: string;
  fromName: string;
  message: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  await getResend().emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: toEmail,
    subject: `${fromName} challenged you on PM Streak! ⚔️`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#111;color:#fff;border-radius:16px;padding:32px">
        <h1 style="font-size:24px;margin:0 0 8px">⚔️ You've been challenged!</h1>
        <p style="color:#aaa;margin:0 0 24px">From <strong style="color:#fff">${fromName}</strong></p>
        <div style="background:#1a1a1a;border-radius:12px;padding:16px;margin-bottom:24px;font-size:14px;color:#ccc">
          "${message}"
        </div>
        <a href="${APP_URL}/social" style="display:inline-block;background:#58cc02;color:#fff;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:12px;font-size:15px">
          Accept Challenge →
        </a>
        ${footer()}
      </div>
    `,
  });
}

export async function sendChallengeAcceptedEmail({
  toEmail,
  toName,
  fromName,
}: {
  toEmail: string;
  toName: string;
  fromName: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  await getResend().emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: toEmail,
    subject: `${fromName} accepted your challenge! 🔥`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#111;color:#fff;border-radius:16px;padding:32px">
        <h1 style="font-size:24px;margin:0 0 8px">🔥 Challenge accepted!</h1>
        <p style="color:#aaa;margin:0 0 24px"><strong style="color:#fff">${fromName}</strong> accepted your challenge. Time to complete today's lesson first!</p>
        <a href="${APP_URL}/dashboard" style="display:inline-block;background:#58cc02;color:#fff;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:12px;font-size:15px">
          Go learn now →
        </a>
        ${footer()}
      </div>
    `,
  });
}
