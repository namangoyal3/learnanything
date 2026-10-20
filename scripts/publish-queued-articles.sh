#!/bin/bash
# Publish queued SEO articles to learnanything.pro/api/content/publish
#
# Usage:
#   CRON_SECRET=<your-secret> ./scripts/publish-queued-articles.sh
#   or set CRON_SECRET in .env.local and source it first
#
# Articles to publish live in scripts/content-queue/*.json

set -euo pipefail

: "${CRON_SECRET:?CRON_SECRET env var must be set}"

APP_URL="${NEXT_PUBLIC_APP_URL:-https://learnanything.pro}"
ENDPOINT="$APP_URL/api/content/publish"
QUEUE_DIR="$(dirname "$0")/content-queue"

publish_article() {
  local file="$1"
  local name
  name=$(basename "$file")
  echo "Publishing $name..."
  local resp
  resp=$(curl -s -X POST "$ENDPOINT" \
    -H "Authorization: Bearer $CRON_SECRET" \
    -H 'Content-Type: application/json' \
    --data @"$file")
  echo "  Response: $resp"
  echo ""
}

echo "=== Publishing queued articles to $ENDPOINT ==="
echo ""

for json_file in "$QUEUE_DIR"/*.json; do
  [ -f "$json_file" ] || { echo "No JSON files found in $QUEUE_DIR"; exit 0; }
  publish_article "$json_file"
done

echo "Done."
