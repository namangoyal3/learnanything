#!/bin/bash

echo "=== PM Streak Missing Features Builder ==="
echo "Following gstack methodology: Investigate → Analyze → Implement"
echo ""

echo "📋 PHASE 1: CRITICAL FEATURES (Week 1)"
echo "========================================"

echo ""
echo "1. NOTES SYSTEM (model Note)"
echo "----------------------------"
echo "Status: ❌ Not built (promised Pro feature)"
echo "Action: Adding Note model to Prisma schema..."

# Backup current schema
cp prisma/schema.prisma prisma/schema.prisma.backup

# Check if Note model already exists
if grep -q "model Note" prisma/schema.prisma; then
    echo "✅ Note model already exists"
else
    # Add Note model before the last line (which should be })
    sed -i '' '/^}$/i\
\
model Note {\
  id        String   @id @default(cuid())\
  userId    String\
  user      User     @relation(fields: [userId], references: [id])\
  lessonId  String?\
  lesson    Lesson?  @relation(fields: [lessonId], references: [id])\
  content   String\
  createdAt DateTime @default(now())\
  updatedAt DateTime @updatedAt\
\
  @@index([userId])\
  @@index([userId, lessonId])\
}' prisma/schema.prisma
    echo "✅ Added Note model to Prisma schema"
fi

echo ""
echo "2. WHATSAPP COMMUNITY INTEGRATION"
echo "---------------------------------"
echo "Status: ❌ Not built (promised Pro feature)"
echo "Action: Creating community page and WhatsApp link..."

# Create community directory
mkdir -p src/app/community

# Create community page
cat > src/app/community/page.tsx << 'EOF'
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isProEffective } from "@/lib/entitlements";
import Link from "next/link";
import { Users, MessageSquare, Lock, Check } from "lucide-react";

export default async function CommunityPage() {
  const userId = await getCurrentUserId();
  let isPro = false;
  let userEmail = "";

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, plan: true, trialEndsAt: true },
    });
    userEmail = user?.email || "";
    isPro = user ? isProEffective(user) : false;
  }

  const whatsappLink = "https://chat.whatsapp.com/YOUR_INVITE_LINK_HERE";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-3">PM Community</h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Connect with fellow product managers, share insights, and grow together.
          </p>
        </div>

        {/* Pro Gate */}
        {!isPro ? (
          <div className="bg-gradient-to-br from-[var(--purple-primary)]/20 to-[var(--bg-card)] border border-[var(--purple-primary)]/30 rounded-2xl p-8 text-center mb-10">
            <Lock className="w-12 h-12 mx-auto mb-4 text-[var(--purple-primary)]" />
            <h2 className="text-2xl font-black mb-3">Exclusive Pro Community</h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              The WhatsApp community is exclusively for PM Streak Pro members.
              Upgrade to connect with 500+ PMs, get job referrals, and join weekly discussions.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--purple-primary)] hover:bg-[var(--purple-dark)] text-white font-black transition-colors"
            >
              Upgrade to Pro
            </Link>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[var(--green-primary)]/20 to-[var(--bg-card)] border border-[var(--green-primary)]/30 rounded-2xl p-8 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Check className="w-8 h-8 text-[var(--green-primary)]" />
              <h2 className="text-2xl font-black">Welcome, Pro Member!</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)]">
                <Users className="w-10 h-10 text-[var(--blue-primary)] mb-4" />
                <h3 className="text-xl font-black mb-2">500+ PMs</h3>
                <p className="text-[var(--text-secondary)]">Active product managers from top tech companies</p>
              </div>
              
              <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)]">
                <MessageSquare className="w-10 h-10 text-[var(--orange-primary)] mb-4" />
                <h3 className="text-xl font-black mb-2">Daily Discussions</h3>
                <p className="text-[var(--text-secondary)]">PM frameworks, interview tips, job opportunities</p>
              </div>
            </div>

            <div className="text-center">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#1da851] text-white text-lg font-black transition-all hover:scale-[1.02]"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
                </svg>
                Join WhatsApp Community
              </a>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                You'll be redirected to WhatsApp to join the group
              </p>
            </div>
          </div>
        )}

        {/* Community Guidelines */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-8 border border-[var(--border-color)]">
          <h2 className="text-2xl font-black mb-6">Community Guidelines</h2>
          <ul className="space-y-4 text-[var(--text-secondary)]">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--green-primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[var(--green-primary)] text-xs font-black">1</span>
              </div>
              <span><strong>Be respectful:</strong> No personal attacks, harassment, or discrimination</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--green-primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[var(--green-primary)] text-xs font-black">2</span>
              </div>
              <span><strong>Stay on topic:</strong> Focus on product management, tech, and career growth</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--green-primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[var(--green-primary)] text-xs font-black">3</span>
              </div>
              <span><strong>No spam:</strong> No promotional content without admin approval</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--green-primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[var(--green-primary)] text-xs font-black">4</span>
              </div>
              <span><strong>Help each other:</strong> Share knowledge, job referrals, and feedback</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
EOF

echo "✅ Created community page at src/app/community/page.tsx"
echo "⚠️  IMPORTANT: Replace YOUR_INVITE_LINK_HERE with actual WhatsApp link"

echo ""
echo "3. CERTIFICATE GENERATION"
echo "-------------------------"
echo "Status: ⚠️ Partially built (needs PDF generation)"
echo "Action: Creating certificate API endpoint..."

mkdir -p src/app/api/certificates

cat > src/app/api/certificates/generate/route.ts << 'EOF'
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isProEffective } from "@/lib/entitlements";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        completedLessons: {
          include: { lesson: true },
          where: { completed: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is Pro
    const isPro = isProEffective(user);
    if (!isPro) {
      return NextResponse.json({ error: "Certificate requires Pro subscription" }, { status: 403 });
    }

    // Check if user has completed enough lessons (e.g., 30 lessons)
    const completedCount = user.completedLessons.length;
    const requiredLessons = 30;
    
    if (completedCount < requiredLessons) {
      return NextResponse.json({ 
        error: `Complete ${requiredLessons} lessons to earn certificate (${completedCount}/${requiredLessons})` 
      }, { status: 400 });
    }

    // For now, return a JSON response
    // TODO: Implement actual PDF generation with libraries like @react-pdf/renderer
    const certificateData = {
      userName: user.name,
      userEmail: user.email,
      completedLessons: completedCount,
      issueDate: new Date().toISOString().split('T')[0],
      certificateId: `PM-CERT-${Date.now()}-${userId.slice(0, 8)}`,
      level: "Product Manager",
      skills: ["Product Strategy", "Metrics & Analytics", "User Research", "Roadmapping", "Stakeholder Management"]
    };

    return NextResponse.json({
      message: "Certificate generated successfully",
      certificate: certificateData,
      downloadUrl: `/api/certificates/download/${certificateData.certificateId}`,
      note: "PDF generation will be implemented in Phase 2"
    });

  } catch (error) {
    console.error("Certificate generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
EOF

echo "✅ Created certificate generation API at src/app/api/certificates/generate/route.ts"
echo "⚠️  TODO: Implement actual PDF generation with @react-pdf/renderer"

echo ""
echo "=== SUMMARY ==="
echo "✅ Phase 1 critical features setup complete:"
echo "   1. Notes System - Database model added"
echo "   2. WhatsApp Community - Page created (needs link)"
echo "   3. Certificate Generation - API created (needs PDF)"
echo ""
echo "📋 NEXT STEPS:"
echo "   1. Run: npx prisma generate"
echo "   2. Run: npx prisma db push"
echo "   3. Create actual WhatsApp group and update link"
echo "   4. Install PDF generation library: npm install @react-pdf/renderer"
echo "   5. Implement notes UI at /notes"
echo ""
echo "🚀 Run: ./scripts/implement-phase2.sh for next phase"