#!/bin/bash
# Publish the 2 new articles written on 2026-08-10.
# Run from a machine whose IP is in learnanything.pro's allowlist.
# Requires bearer token:  export CRON_SECRET="<bearer-token>"

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

publish "growth-pm-vs-core-pm-career-path.json" \
  "Growth PM vs. Core PM: Which Career Path Is Right for You in 2026"

publish "b2b-pm-vs-b2c-pm-career-paths.json" \
  "B2B PM vs. B2C PM: An Honest Career Comparison for 2026"
