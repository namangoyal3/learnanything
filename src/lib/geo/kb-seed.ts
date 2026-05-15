// NOTE: Lyzr KB population cannot be done programmatically via the agent API.
// Documents must be uploaded directly through Lyzr Studio UI:
//   Studio → Knowledge Bases → learnanything_shared_kb → Upload Documents
//
// The KB seed files live at: ~/Desktop/learnanything-kb-seed/ (7 .txt files
// + UPLOAD.md runbook). They replace the old pm-streak corpus as part of
// LEA-26 (Phase 1.1 of LEA-20): the swarm now targets learnanything.pro.
//
// This module provides a KB health check — asks Cortex a learnanything.pro
// pricing question and verifies it can recall facts from the KB.

import { callAgent, Agents } from "@/lib/lyzr";

export async function verifyKB(sessionId = `kb-verify-${Date.now()}`) {
  const response = await callAgent(
    Agents.cortex(),
    "What is learnanything.pro's pricing? What are the Free vs Pro plan limits, and how does the 7-day Pro trial work?",
    sessionId,
    { timeoutMs: 60_000 }
  );
  const text = response.response.toLowerCase();
  // Healthy = Cortex recalls learnanything.pro pricing facts from the KB:
  // Free / 3 lessons / $12 Pro / 7-day trial. Require at least two distinct
  // facts so a generic "it has a free and paid plan" answer does not pass.
  const signals = [
    text.includes("free"),
    text.includes("$12") || text.includes("12/mo") || text.includes("12 per month") || text.includes("12 a month"),
    text.includes("trial"),
    text.includes("3 lesson") || text.includes("three lesson") || text.includes("unlimited"),
  ];
  const hits = signals.filter(Boolean).length;
  const mentionsLearnanything = text.includes("learnanything") || text.includes("learn anything");
  return {
    response: response.response,
    kbHealthy: hits >= 2 && mentionsLearnanything,
  };
}
