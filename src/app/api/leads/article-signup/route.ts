import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  articleSlug: z.string().min(1),
  vertical: z.string().min(1),
});

// Same-origin pages (job-outreach) need nothing here. The ctrl+all landing
// page is hosted elsewhere and posts its waitlist here, so those origins get
// CORS; everything else keeps the browser's same-origin default.
const ALLOWED_ORIGINS = new Set([
  "https://namangoyal3.github.io",
  "https://ctrlall.app",
  "https://www.ctrlall.app",
]);

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.has(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

export async function POST(req: Request) {
  const headers = corsHeaders(req);
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400, headers }
      );
    }

    const { email, articleSlug, vertical } = parsed.data;

    // Anonymous visitors have no User row, so leads get their own table
    // instead of the user-scoped ExperimentEvent. Upsert dedupes resubmits.
    await prisma.articleLead.upsert({
      where: { email_articleSlug: { email, articleSlug } },
      create: { email, articleSlug, vertical, source: "article_inline" },
      update: {},
    });

    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    console.error("article-signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers }
    );
  }
}
