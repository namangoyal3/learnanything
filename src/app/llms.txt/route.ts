import { NextResponse } from "next/server";
import { getLlmsTxt } from "@/lib/md/agent-files";

/**
 * /llms.txt — site map for language models (llmstxt.org). Generated from the
 * public route list and the DB, so it never goes stale; the CDN keeps it a day.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return new NextResponse(await getLlmsTxt(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
