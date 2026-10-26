import { NextResponse, type NextRequest } from "next/server";
import { getLlmsFullTxt } from "@/lib/md/agent-files";

/**
 * /llms-full.txt — core pages, research, the newest articles and legal pages as
 * one markdown file, rendered by the same registry as the .md twins. Built on
 * demand and cached hard at the CDN, never per user.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const body = await getLlmsFullTxt(req.nextUrl.origin);
  if (body.length > 500_000) console.warn(`[llms-full] ${body.length} chars, over the 500k target`);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
