#!/bin/bash
# Publish 2 new SEO articles written on 2026-07-28 by the automated content pipeline.
# Run from a machine with network access to learnanything.pro.
# Requires CRON_SECRET in environment:  export CRON_SECRET="<bearer_token>"

set -euo pipefail

: "${CRON_SECRET:?CRON_SECRET must be set}"

API_URL="https://learnanything.pro/api/content/publish"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

publish() {
  local file="$1"
  local label="$2"
  echo "Publishing: $label"
  response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL" \
    -H "Authorization: Bearer $CRON_SECRET" \
    -H "Content-Type: application/json" \
    --data-binary "@${SCRIPT_DIR}/${file}")
  http_status=$(echo "$response" | grep -o 'HTTP_STATUS:[0-9]*' | cut -d: -f2)
  body=$(echo "$response" | sed '/HTTP_STATUS:/d')
  echo "  HTTP: $http_status"
  echo "  Response: $body"
  echo ""
}

publish "pm-execution-interview-framework-metrics-root-cause.json" \
  "PM Execution Interview: Metrics, Root Cause, and Trade-off Questions (~1400 words)"

publish "how-product-managers-build-trust-with-engineering-teams.json" \
  "How PMs Build Trust with Engineering Teams (~1300 words)"

echo "Done. Check https://learnanything.pro/learn for published articles."
