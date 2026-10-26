import { NextResponse } from "next/server";
import { getA2AAgentCard, getAgenticSiteManifest } from "@/lib/agentic-site";
import { getLlmsTxt } from "@/lib/md/agent-files";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function jsonRpcResponse(id: unknown) {
  const now = new Date().toISOString();
  const manifest = getAgenticSiteManifest();
  return {
    jsonrpc: "2.0",
    id: id ?? null,
    result: {
      id: `pm-streak-context-${Date.now()}`,
      contextId: "pm-streak-public-site-context",
      status: {
        state: "completed",
        timestamp: now,
      },
      artifacts: [
        {
          artifactId: "llms-full",
          // llms.txt, not llms-full: this POST is uncached, so it must stay cheap. Full text: /llms-full.txt.
          name: "PM Streak LLM context (llms.txt)",
          parts: [{ kind: "text", text: await getLlmsTxt() }],
        },
        {
          artifactId: "agentic-site-manifest",
          name: "PM Streak agent manifest",
          parts: [{ kind: "data", data: manifest }],
        },
      ],
    },
  };
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    card: getA2AAgentCard(),
    manifest: getAgenticSiteManifest(),
    llms_txt: await getLlmsTxt(),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  if (isObject(body) && typeof body.jsonrpc === "string") {
    return NextResponse.json(await jsonRpcResponse(body.id));
  }

  return NextResponse.json({
    ok: true,
    mode: "read-only",
    query: isObject(body) && typeof body.query === "string" ? body.query : null,
    llms_txt: await getLlmsTxt(),
    llms_full_txt_url: "/llms-full.txt",
    manifest: getAgenticSiteManifest(),
  });
}
