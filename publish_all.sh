#!/bin/bash
# Run this script from any machine with internet access to publish both articles.

AUTH="Authorization: Bearer 335644a93f2103b28f2a82c96b5ede6e3dadc39013877954b4a555fdd3c012c2"
ENDPOINT="https://learnanything.pro/api/content/publish"

echo "=== Publishing Article 1: PM to Senior PM Promotion System ==="
curl -s -X POST "$ENDPOINT" \
  -H "$AUTH" \
  -H 'Content-Type: application/json' \
  --data-binary @publish_article1.json
echo ""
echo ""

echo "=== Publishing Article 2: AI Product Manager Skills ==="
curl -s -X POST "$ENDPOINT" \
  -H "$AUTH" \
  -H 'Content-Type: application/json' \
  --data-binary @publish_article2.json
echo ""
