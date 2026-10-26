import { getAiTxt } from "@/lib/md/agent-files";

/** /ai.txt — usage policy for AI systems (ai-visibility.org.uk ai-txt spec v1.1.1). */
export function GET() {
  return new Response(getAiTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
