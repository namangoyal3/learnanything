#!/usr/bin/env bash
# Publishes the 3 articles drafted on 2026-07-08.
# Run from any machine with outbound HTTPS to learnanything.pro.
# Usage: bash scripts/seo-output/publish-20260708.sh

set -euo pipefail

ENDPOINT="https://learnanything.pro/api/content/publish"
AUTH="Bearer ***REMOVED***"
DIR="$(cd "$(dirname "$0")" && pwd)"

publish() {
  local slug="$1"
  local title="$2"
  local description="$3"
  local primary_keyword="$4"
  local tags="$5"
  local source_urls="$6"
  local body_file="$DIR/$slug.md"

  # Strip YAML frontmatter (lines between --- delimiters)
  local body
  body=$(awk '/^---/{found++; next} found==2{print}' "$body_file")

  python3 - <<PYEOF
import json, urllib.request, sys

endpoint = "$ENDPOINT"
auth = "$AUTH"

body = open("$body_file").read()
# Strip YAML frontmatter
lines = body.split("\n")
in_fm = False
fm_count = 0
content_lines = []
for line in lines:
    if line.strip() == "---":
        fm_count += 1
        in_fm = fm_count < 2
        continue
    if fm_count >= 2:
        content_lines.append(line)
body = "\n".join(content_lines).strip()

payload = json.dumps({
    "title": "$title",
    "description": "$description",
    "body": body,
    "vertical": "pm",
    "tags": $tags,
    "primaryKeyword": "$primary_keyword",
    "sourceUrls": $source_urls
}).encode("utf-8")

req = urllib.request.Request(endpoint, data=payload,
    headers={"Authorization": auth, "Content-Type": "application/json"},
    method="POST")

try:
    with urllib.request.urlopen(req) as r:
        print(f"[OK] $slug — HTTP {r.status}")
        print(r.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print(f"[FAIL] $slug — HTTP {e.code}")
    print(e.read().decode("utf-8"))
    sys.exit(1)
PYEOF
}

echo "Publishing 3 articles..."

publish \
  "pm-job-market-2026" \
  "The PM Job Market in 2026: What 7,300 Open Roles Reveal About What Hiring Managers Actually Want" \
  "With 7,300 PM openings and 61% requiring AI experience, the market is recovering — but only for candidates who understand what's changed." \
  "product manager job market 2026" \
  '["product management","PM career","job market 2026","product manager jobs","AI PM"]' \
  '["https://dev.to/pooyagolchian/state-of-the-product-job-market-in-early-2026-391c","https://www.lennysnewsletter.com/p/state-of-the-product-job-market-in-ee9","https://blog.productmanagementsociety.com/product-management-hiring-trends-2026-breakdown-by-country/"]'

publish \
  "pm-to-senior-pm-promotion-playbook" \
  "How to Get Promoted from PM to Senior PM: The Evidence-Based Playbook" \
  "The Google L4→L5 bar isn't about working harder. Here's the specific evidence stack that moves promotion committees at top tech companies." \
  "how to get promoted to senior product manager" \
  '["PM promotion","senior product manager","career growth","product management","Google PM"]' \
  '["https://sirjohnnymai.com/blog/google-pm-career-path-2026/","https://talenteconomy.ai/blog/the-senior-product-manager-scorecard-essential-metrics-for-strategic-hires","https://amplifypm.com/why-advancing-from-senior-pm-to-product-leader-is-so-hard-and-how-to-break-through/"]'

publish \
  "ai-product-manager-skills-stack" \
  "The AI Product Manager Skills Stack: What You Actually Need Right Now" \
  "61% of PM job postings require AI experience and AI PMs earn 15-30% more. Here's the exact technical, strategic, and ethical skill stack to build." \
  "AI product manager skills" \
  '["AI product manager","AI skills","product management","machine learning PM","PM career"]' \
  '["https://www.airtable.com/articles/product-manager-skills","https://www.eicta.iitk.ac.in/knowledge-hub/product-management/ai-product-manager-skills","https://amoeboids.com/blog/ai-skills-for-product-managers-2026/"]'

echo "Done."
