#!/bin/bash
# Run this locally to publish all 3 SEO articles to learnanything.pro
# Usage: bash seo-drafts/publish-all.sh

set -e
API="https://learnanything.pro/api/content/publish"
TOKEN="335644a93f2103b28f2a82c96b5ede6e3dadc39013877954b4a555fdd3c012c2"

ARTICLES=(
  "seo-drafts/pm-job-market-2026.json"
  "seo-drafts/how-to-get-promoted-senior-pm.json"
  "seo-drafts/ai-product-manager-skills-2026.json"
)

for file in "${ARTICLES[@]}"; do
  echo ""
  echo "Publishing: $file"
  response=$(curl -s -X POST "$API" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    --data-binary "@$file")
  echo "Response: $response"
  echo "---"
done

echo ""
echo "All articles submitted."
