import { NextResponse } from "next/server";
import { getLlmsTxt } from "@/lib/md/agent-files";

/**
 * Backward-compatible endpoint for older clients that fetched /api/llms.
 * The canonical files are /llms.txt and /llms-full.txt.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return new NextResponse(await getLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
