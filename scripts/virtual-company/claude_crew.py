"""
Claude-native Virtual Enterprise Swarm for PM Streak.

Replaces CrewAI/Groq with Claude Code's native agent system.
Each CXO agent is defined in .claude/agents/ and invoked via `claude -p`.
"""

import os
import re
import subprocess
import sys
import json
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent.parent
AGENTS_DIR = REPO_ROOT / ".claude" / "agents"


def run_agent(agent_name: str, prompt: str, timeout: int = 120) -> str:
    """Invoke a Claude Code agent via `claude -p --agent <name> '<prompt>'`."""
    print(f"\n🤖 [{agent_name.upper()}] Running...")
    try:
        result = subprocess.run(
            [
                "claude",
                "-p",
                "--dangerously-skip-permissions",
                f"You are the {agent_name} subagent. {prompt}",
            ],
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=str(REPO_ROOT),
            env={**os.environ, "CLAUDE_AGENT": agent_name},
        )
        output = result.stdout.strip()
        if result.returncode != 0 and result.stderr:
            print(f"  ⚠ stderr: {result.stderr[:200]}")
        print(f"  ✓ {agent_name} completed ({len(output)} chars)")
        return output
    except subprocess.TimeoutExpired:
        print(f"  ⏱ {agent_name} timed out after {timeout}s")
        return f"[{agent_name} TIMEOUT]"
    except FileNotFoundError:
        print(f"  ❌ `claude` CLI not found — ensure Claude Code is installed")
        return f"[{agent_name} CLI NOT FOUND]"


def load_agent_system_prompt(agent_name: str) -> str:
    """Load the agent's system prompt from .claude/agents/."""
    agent_file = AGENTS_DIR / f"{agent_name}.md"
    if not agent_file.exists():
        return ""
    content = agent_file.read_text()
    # Strip frontmatter
    if content.startswith("---"):
        end = content.find("---", 3)
        if end != -1:
            return content[end + 3:].strip()
    return content.strip()


def execute_company_mission(
    directive: str,
    ga4_property_id: str = "529697573",
    memory_context: str = "",
) -> dict:
    """
    Run the full 8-CXO board meeting using Claude native agents.
    Returns dict with pr_url, cqo_verdict, result.
    """

    print(f"\n{'='*60}")
    print("PM Streak Virtual Board Meeting — Claude Native Swarm")
    print(f"{'='*60}")

    context_block = f"""
## Prior Meeting Memory
{memory_context or 'No prior meetings on record.'}

## This Week's Directive
{directive}

## PM Streak Quick Facts
- 123 real users, pre-revenue
- Stack: Next.js 14, TypeScript, Prisma/Neon, Vercel, Tailwind
- Domain: learnanything.pro | GitHub: namangoyal3/pm-streak
- Revenue: Free + Pro via Dodo Payments
"""

    # ── CDO: Pull data insights ──────────────────────────────────────────
    cdo_output = run_agent(
        "cdo-pm-streak",
        f"""{context_block}

As CDO, analyze our funnel and retention data. Query the Neon DB using the DATABASE_URL
environment variable to find: signup counts (last 7 days), users active in last 14 days,
Pro conversion rate, and key drop-off points. Return your structured Data Findings report.""",
        timeout=90,
    )

    # ── CCO: Customer experience audit ──────────────────────────────────
    cco_output = run_agent(
        "cco-pm-streak",
        f"""{context_block}

## CDO Data Findings
{cdo_output}

As CCO, audit the customer journey. Read onboarding-related files in src/components/ or src/app/
to identify friction points. Return your structured CCO Report.""",
        timeout=90,
    )

    # ── CRO: Revenue analysis ────────────────────────────────────────────
    cro_output = run_agent(
        "cro-pm-streak",
        f"""{context_block}

## CDO Data Findings
{cdo_output}

As CRO, model the revenue impact of fixing our biggest conversion blocker.
Return your structured CRO Report.""",
        timeout=60,
    )

    # ── CMO: Marketing strategy ──────────────────────────────────────────
    cmo_output = run_agent(
        "cmo-pm-streak",
        f"""{context_block}

## CDO Data Findings
{cdo_output}

## CRO Revenue Analysis
{cro_output}

As CMO, write the growth narrative for this week's change. Return your CMO Report.""",
        timeout=60,
    )

    # ── CPO: Product spec ────────────────────────────────────────────────
    cpo_output = run_agent(
        "cpo-pm-streak",
        f"""{context_block}

## CDO Data Findings
{cdo_output}

## CCO Customer Report
{cco_output}

## CRO Revenue Analysis
{cro_output}

As CPO, write the product spec for the highest-leverage experiment.
Check file sizes with Glob before speccing. ONLY spec files <150 lines.
Never spec changes to page.tsx or layout.tsx.
Return your structured Product Recommendation.""",
        timeout=90,
    )

    # ── CTO: Implementation ──────────────────────────────────────────────
    cto_output = run_agent(
        "cto-pm-streak",
        f"""{context_block}

## CPO Product Spec
{cpo_output}

As CTO, implement the CPO's spec:
1. Use Read tool to read the target file first
2. If file >150 lines: STOP and report, do not implement
3. Make a surgical edit with the Edit tool
4. Create a git branch: ai-swarm/[timestamp]
5. Commit and push: gh pr create ...
6. Return the PR URL as: PR_URL: https://github.com/...""",
        timeout=180,
    )

    # ── CQO: Quality gate ────────────────────────────────────────────────
    cqo_output = run_agent(
        "cqo-pm-streak",
        f"""{context_block}

## CPO Spec
{cpo_output}

## CTO Implementation
{cto_output}

As CQO, review the PR. Run `gh pr diff` on the PR number from the CTO output.
Run `npx tsc --noEmit` to check TypeScript.
Issue your verdict: [CQO_VERDICT: APPROVE] or [CQO_VERDICT: REJECT]""",
        timeout=90,
    )

    # ── CEO: Synthesis ───────────────────────────────────────────────────
    ceo_output = run_agent(
        "ceo-pm-streak",
        f"""{context_block}

## CDO Report
{cdo_output}

## CPO Spec
{cpo_output}

## CTO PR
{cto_output}

## CQO Verdict
{cqo_output}

## CMO Strategy
{cmo_output}

## CRO Revenue Model
{cro_output}

## CCO Customer Insights
{cco_output}

As CEO, synthesize all CXO reports into a final board summary.
State what shipped, what the expected impact is, and echo the CQO verdict.
End with [CQO_VERDICT: APPROVE] or [CQO_VERDICT: REJECT].""",
        timeout=90,
    )

    # ── Extract PR URL and verdict ───────────────────────────────────────
    all_outputs = "\n".join([cto_output, cqo_output, ceo_output])

    pr_url = ""
    pr_match = re.search(r"https://github\.com/[^\s/]+/[^\s/]+/pull/\d+", all_outputs)
    if pr_match:
        pr_url = pr_match.group(0)

    cqo_verdict = "UNKNOWN"
    verdict_match = re.search(r"\[CQO_VERDICT:\s*(APPROVE|REJECT)\]", all_outputs)
    if verdict_match:
        cqo_verdict = verdict_match.group(1)

    full_result = f"""
## Board Meeting Summary

### CDO: Data Findings
{cdo_output}

### CCO: Customer Insights
{cco_output}

### CRO: Revenue Analysis
{cro_output}

### CMO: Marketing Strategy
{cmo_output}

### CPO: Product Recommendation
{cpo_output}

### CTO: Implementation
{cto_output}

### CQO: Quality Verdict
{cqo_output}

### CEO: Final Synthesis
{ceo_output}
"""

    return {
        "pr_url": pr_url,
        "cqo_verdict": cqo_verdict,
        "result": full_result,
    }
