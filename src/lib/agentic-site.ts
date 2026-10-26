/**
 * agentic-site.ts — Machine-readable site description and agent manifest for AI crawlers.
 *
 * Exports (llms.txt / llms-full.txt / ai.txt live in src/lib/md/agent-files.ts):
 *   getAgenticSiteManifest() — /agents.json and /.well-known/ai-agent.json
 *   getA2AAgentCard()       — /.well-known/agent-card.json (A2A protocol)
 *   agentSwarm              — GEO agent registry for /api/geo/health
 */

import { SITE_CONTACT_EMAIL, SITE_URL } from "@/lib/site";

// ── Agent swarm registry ───────────────────────────────────────────────────────

export const agentSwarm: Array<{
  id: string;
  name: string;
  visibility: "internal" | "public";
  trigger: "cron" | "manual" | "event";
  cadence: string;
}> = [
  { id: "cortex",    name: "Cortex",    visibility: "internal", trigger: "cron",   cadence: "daily 00:45 UTC" },
  { id: "blueprint", name: "Blueprint", visibility: "internal", trigger: "manual", cadence: "on-demand" },
  { id: "scout",     name: "Scout",     visibility: "internal", trigger: "cron",   cadence: "daily 01:00 UTC" },
  { id: "forge",     name: "Forge",     visibility: "internal", trigger: "manual", cadence: "on-demand" },
  { id: "rival",     name: "Rival",     visibility: "internal", trigger: "cron",   cadence: "daily 01:00 UTC" },
  { id: "anchor",    name: "Anchor",    visibility: "internal", trigger: "cron",   cadence: "daily 01:30 UTC" },
  { id: "pulse",     name: "Pulse",     visibility: "internal", trigger: "cron",   cadence: "daily 01:15 UTC" },
  { id: "signal",    name: "Signal",    visibility: "internal", trigger: "manual", cadence: "on-demand" },
  { id: "conductor", name: "Conductor", visibility: "internal", trigger: "manual", cadence: "on-demand" },
];

// ── Agentic site manifest (/agents.json, /.well-known/ai-agent.json) ──────────

export function getAgenticSiteManifest(): Record<string, unknown> {
  return {
    schema_version: "1.0",
    name: "PM Streak",
    description:
      "Daily PM learning platform with 800+ expert articles on product management, frameworks, and interview prep.",
    url: SITE_URL,
    capabilities: ["read", "search", "learn"],
    contact: { email: SITE_CONTACT_EMAIL },
    content: {
      topics: [
        "product management",
        "PM frameworks",
        "product strategy",
        "PM interviews",
        "user research",
        "roadmapping",
        "stakeholder management",
      ],
      article_count: "800+",
      update_frequency: "daily",
      language: "en-US",
    },
    endpoints: {
      llms_txt: `${SITE_URL}/llms.txt`,
      llms_full_txt: `${SITE_URL}/llms-full.txt`,
      sitemap: `${SITE_URL}/sitemap.xml`,
      context: `${SITE_URL}/api/agents/pm-streak-context`,
    },
    agent_card: `${SITE_URL}/.well-known/agent-card.json`,
    llms_txt: `${SITE_URL}/llms.txt`,
  };
}

// ── A2A agent card (/.well-known/agent-card.json) ────────────────────────────

export function getA2AAgentCard(): Record<string, unknown> {
  return {
    schema_version: "1.0",
    name: "PM Streak Context Agent",
    description:
      "Provides structured PM learning content, article summaries, and framework references from PM Streak's 800+ article library.",
    url: `${SITE_URL}/api/agents/pm-streak-context`,
    version: "1.0.0",
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    authentication: {
      schemes: ["none"],
    },
    defaultInputModes: ["application/json"],
    defaultOutputModes: ["application/json"],
    skills: [
      {
        id: "pm-streak-context",
        name: "PM Streak Context",
        description:
          "Returns the full llms.txt content, agentic site manifest, and structured data about PM Streak's learning content.",
        inputModes: ["application/json"],
        outputModes: ["application/json"],
        examples: [
          { input: '{"query": "PM frameworks"}', output: "llms.txt content with PM framework references" },
        ],
      },
    ],
  };
}
