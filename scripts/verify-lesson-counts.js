const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyLessonClaims() {
  console.log('🔍 Verifying PM Streak Lesson Claims...\n');
  
  try {
    // 1. Total lesson count
    const totalLessons = await prisma.lesson.count();
    console.log(`📊 Total Lessons in Database: ${totalLessons}`);
    
    // 2. AI-generated vs non-AI lessons
    const aiLessons = await prisma.lesson.count({
      where: { aiGenerated: true }
    });
    
    const nonAiLessons = await prisma.lesson.count({
      where: { aiGenerated: false }
    });
    
    console.log(`🤖 AI-Generated Lessons: ${aiLessons}`);
    console.log(`📚 Non-AI (Archive) Lessons: ${nonAiLessons}`);
    
    // 3. Check for PM Leader lessons (search by title/content)
    const leaderKeywords = ['shreyas', 'aakash', 'marty', 'cagan', 'leader'];
    
    const leaderLessons = await prisma.lesson.findMany({
      where: {
        OR: [
          ...leaderKeywords.map(keyword => ({
            title: { contains: keyword, mode: 'insensitive' }
          })),
          ...leaderKeywords.map(keyword => ({
            content: { contains: keyword, mode: 'insensitive' }
          }))
        ]
      },
      select: { id: true, title: true, aiGenerated: true }
    });
    
    console.log(`\n👑 PM Leader Lessons Found: ${leaderLessons.length}`);
    if (leaderLessons.length > 0) {
      console.log('Leader Lesson Titles:');
      leaderLessons.forEach(lesson => {
        console.log(`  - ${lesson.title} ${lesson.aiGenerated ? '(AI)' : '(Archive)'}`);
      });
    }
    
    // 4. Check lesson categories/types
    const lessonTypes = await prisma.lesson.groupBy({
      by: ['type'],
      _count: true,
      where: { type: { not: null } }
    });
    
    console.log('\n📋 Lesson Types Breakdown:');
    lessonTypes.forEach(type => {
      console.log(`  - ${type.type || 'Unknown'}: ${type._count}`);
    });
    
    // 5. Check for "Deeper Dives" references
    const deeperDiveLessons = await prisma.lesson.findMany({
      where: {
        OR: [
          { title: { contains: 'deeper', mode: 'insensitive' } },
          { title: { contains: 'dive', mode: 'insensitive' } },
          { content: { contains: 'deeper dive', mode: 'insensitive' } }
        ]
      },
      select: { id: true, title: true }
    });
    
    console.log(`\n🔍 Deeper Dive References Found: ${deeperDiveLessons.length}`);
    if (deeperDiveLessons.length > 0) {
      deeperDiveLessons.forEach(lesson => {
        console.log(`  - ${lesson.title}`);
      });
    }
    
    // 6. Summary
    console.log('\n🎯 CLAIM VERIFICATION SUMMARY:');
    console.log(`✅ 292+ Archive Lessons Claim: ${nonAiLessons >= 292 ? 'TRUE' : `FALSE (only ${nonAiLessons} found)`}`);
    console.log(`✅ PM Leader Lessons Claim: ${leaderLessons.length > 0 ? 'TRUE' : 'FALSE (none found by name)'}`);
    console.log(`✅ Deeper Dives Feature: ${deeperDiveLessons.length > 0 ? 'REFERENCES FOUND' : 'NO DIRECT REFERENCES'}`);
    
    if (nonAiLessons < 292) {
      console.log(`\n⚠️ WARNING: Claim says 292+ archive lessons, but database has only ${nonAiLessons}`);
      console.log(`   Missing: ${292 - nonAiLessons} lessons`);
    }
    
    if (leaderLessons.length === 0) {
      console.log(`\n⚠️ WARNING: No PM Leader lessons found by name (Shreyas, Aakash, Marty Cagan)`);
      console.log(`   Check if they exist under different titles or are AI-generated on demand`);
    }
    
  } catch (error) {
    console.error('❌ Error verifying lessons:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyLessonClaims();