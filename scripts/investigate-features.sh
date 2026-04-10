#!/bin/bash

echo "=== PM Streak Feature Reality Check ==="
echo "Date: $(date)"
echo "Methodology: gstack investigate"
echo ""

echo "1. CHECKING CORE CURRICULUM LESSONS:"
echo "-------------------------------------"
echo "a) Lesson database:"
find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "lesson\|curriculum" | head -5
echo ""

echo "b) Prisma schema for lessons:"
if [ -f "prisma/schema.prisma" ]; then
    grep -n "model Lesson\|model Curriculum" prisma/schema.prisma | head -10
else
    echo "   ❌ Prisma schema not found"
fi
echo ""

echo "2. CHECKING CREDIT SYSTEM:"
echo "--------------------------"
echo "a) Credit-related code:"
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "credit" | head -5
echo ""

echo "b) User model with credits:"
if [ -f "prisma/schema.prisma" ]; then
    grep -n "credits\|credit" prisma/schema.prisma | head -10
fi
echo ""

echo "3. CHECKING AI EXPLORE LESSONS:"
echo "-------------------------------"
echo "a) AI lesson generation:"
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "AI\|Explore\|generate" | head -5
echo ""

echo "b) API routes for AI:"
find src/app/api -type f -name "*.ts" | head -10
echo ""

echo "4. CHECKING STREAK TRACKING:"
echo "----------------------------"
echo "a) Streak-related code:"
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "streak" | head -5
echo ""

echo "5. CHECKING INTERVIEW PREP:"
echo "---------------------------"
echo "a) Interview prep code:"
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "interview" | head -5
echo ""

echo "6. CHECKING JOBS BOARD:"
echo "-----------------------"
echo "a) Jobs board code:"
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "job\|career\|board" | head -5
echo ""

echo "7. CHECKING WHATSAPP COMMUNITY:"
echo "-------------------------------"
echo "a) Community/WhatsApp references:"
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "community\|whatsapp\|group" | head -5
echo ""

echo "8. CHECKING LEARNING ROADMAP:"
echo "-----------------------------"
echo "a) Roadmap/planning code:"
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "roadmap\|plan\|progress" | head -5
echo ""

echo "9. CHECKING CERTIFICATE SYSTEM:"
echo "-------------------------------"
echo "a) Certificate generation:"
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "certificate\|completion" | head -5
echo ""

echo "10. CHECKING DEEPER DIVES:"
echo "--------------------------"
echo "a) Deeper dive feature:"
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "deeper\|dive" | head -5
echo ""

echo "=== INITIAL ASSESSMENT ==="
echo ""
echo "To get accurate results, we need to:"
echo "1. Examine the database schema"
echo "2. Check API endpoints"
echo "3. Review component implementations"
echo "4. Test actual functionality"
echo ""
echo "Run: ./scripts/check-feature-status.js for detailed analysis"