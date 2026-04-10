#!/usr/bin/env node

/**
 * PM Streak Feature Reality Check
 * gstack investigate methodology
 * Checks which features are actually built vs. just mentioned in pricing
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();

// Feature definitions from pricing page
const FEATURES = {
  free: [
    "7 core curriculum lessons",
    "5 archive lessons (batch-unlocked)",
    "5 credits / month",
    "1 AI Explore lesson / week",
    "Basic streak tracking"
  ],
  pro: [
    "Everything in Free",
    "All 292+ archive lessons unlocked",
    "100 credits / month",
    "Unlimited AI Explore lessons",
    "Unlimited Deeper Dives",
    "Unlimited AI Interview prep sessions",
    "Priority PM Jobs board access",
    "Exclusive WhatsApp PM community",
    "Save Notes & Recaps",
    "Personalized learning roadmap",
    "Certificate of completion",
    "Priority email support",
    "30-day money-back guarantee"
  ]
};

// Check functions for each feature type
const featureChecks = {
  // 1. Curriculum lessons check
  "7 core curriculum lessons": () => {
    const schema = fs.readFileSync(path.join(PROJECT_ROOT, 'prisma/schema.prisma'), 'utf8');
    const hasLessonModel = schema.includes('model Lesson');
    const hasCategoryModel = schema.includes('model Category');
    
    // Check if there are actual lesson files
    const lessonFiles = [];
    try {
      const files = fs.readdirSync(path.join(PROJECT_ROOT, 'src/app/learn'));
      lessonFiles.push(...files.filter(f => f.endsWith('.tsx') || f.endsWith('.ts')));
    } catch (e) {}
    
    return {
      implemented: hasLessonModel && hasCategoryModel,
      evidence: hasLessonModel ? '✅ Lesson model exists in Prisma schema' : '❌ No Lesson model',
      details: `Found ${lessonFiles.length} lesson-related files`
    };
  },

  "5 archive lessons (batch-unlocked)": () => {
    const schema = fs.readFileSync(path.join(PROJECT_ROOT, 'prisma/schema.prisma'), 'utf8');
    const hasLockedField = schema.includes('isLocked') && schema.includes('Boolean');
    const hasUnlockedBatch = schema.includes('unlockedBatch') && schema.includes('Int');
    
    return {
      implemented: hasLockedField && hasUnlockedBatch,
      evidence: hasLockedField ? '✅ Lesson locking system exists' : '❌ No lesson locking',
      details: hasUnlockedBatch ? '✅ Batch unlocking system exists' : '❌ No batch unlocking'
    };
  },

  "5 credits / month": () => {
    const schema = fs.readFileSync(path.join(PROJECT_ROOT, 'prisma/schema.prisma'), 'utf8');
    const hasCreditsField = schema.includes('credits') && schema.includes('Int');
    const hasCreditsRefreshed = schema.includes('creditsRefreshedAt');
    
    // Check credit usage in code
    let creditUsageFiles = 0;
    try {
      const srcDir = path.join(PROJECT_ROOT, 'src');
      const checkDir = (dir) => {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            checkDir(fullPath);
          } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('credits') || content.includes('credit')) {
              creditUsageFiles++;
            }
          }
        }
      };
      checkDir(srcDir);
    } catch (e) {}
    
    return {
      implemented: hasCreditsField && hasCreditsRefreshed,
      evidence: hasCreditsField ? '✅ Credit system in database' : '❌ No credit system',
      details: `Found ${creditUsageFiles} files using credits`
    };
  },

  "1 AI Explore lesson / week": () => {
    // Check for AI generation endpoints
    const apiDir = path.join(PROJECT_ROOT, 'src/app/api');
    let aiEndpoints = [];
    
    try {
      const files = fs.readdirSync(apiDir, { recursive: true });
      aiEndpoints = files.filter(f => 
        f.includes('generate') || f.includes('ai') || f.includes('explore')
      );
    } catch (e) {}
    
    // Check explore page
    const explorePage = path.join(PROJECT_ROOT, 'src/app/explore/page.tsx');
    const hasExplorePage = fs.existsSync(explorePage);
    
    return {
      implemented: aiEndpoints.length > 0 && hasExplorePage,
      evidence: aiEndpoints.length > 0 ? `✅ ${aiEndpoints.length} AI endpoints found` : '❌ No AI endpoints',
      details: hasExplorePage ? '✅ Explore page exists' : '❌ No explore page'
    };
  },

  "Basic streak tracking": () => {
    const schema = fs.readFileSync(path.join(PROJECT_ROOT, 'prisma/schema.prisma'), 'utf8');
    const hasStreakFields = 
      schema.includes('streakCount') && 
      schema.includes('longestStreak') &&
      schema.includes('streakFreezes');
    
    // Check streak-related components
    let streakComponents = 0;
    try {
      const srcDir = path.join(PROJECT_ROOT, 'src');
      const checkDir = (dir) => {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            checkDir(fullPath);
          } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('streak') || content.includes('Streak')) {
              streakComponents++;
            }
          }
        }
      };
      checkDir(srcDir);
    } catch (e) {}
    
    return {
      implemented: hasStreakFields,
      evidence: hasStreakFields ? '✅ Streak fields in database' : '❌ No streak tracking',
      details: `Found ${streakComponents} streak-related components`
    };
  },

  "All 292+ archive lessons unlocked": () => {
    // This is just a pricing claim - check if there are actually 292+ lessons
    const schema = fs.readFileSync(path.join(PROJECT_ROOT, 'prisma/schema.prisma'), 'utf8');
    const hasLessonModel = schema.includes('model Lesson');
    
    return {
      implemented: hasLessonModel,
      evidence: hasLessonModel ? '✅ Lesson system exists' : '❌ No lesson system',
      details: 'Note: Actual lesson count would need database query'
    };
  },

  "100 credits / month": () => {
    // Same credit system check as free tier
    const schema = fs.readFileSync(path.join(PROJECT_ROOT, 'prisma/schema.prisma'), 'utf8');
    const hasCreditsField = schema.includes('credits') && schema.includes('Int');
    
    return {
      implemented: hasCreditsField,
      evidence: hasCreditsField ? '✅ Credit system exists' : '❌ No credit system',
      details: 'Pro tier would need logic for 100 vs 5 credits'
    };
  },

  "Unlimited AI Explore lessons": () => {
    // Same AI check as free tier
    const apiDir = path.join(PROJECT_ROOT, 'src/app/api');
    let aiEndpoints = [];
    
    try {
      const files = fs.readdirSync(apiDir, { recursive: true });
      aiEndpoints = files.filter(f => 
        f.includes('generate') || f.includes('ai') || f.includes('explore')
      );
    } catch (e) {}
    
    return {
      implemented: aiEndpoints.length > 0,
      evidence: aiEndpoints.length > 0 ? `✅ ${aiEndpoints.length} AI endpoints found` : '❌ No AI endpoints',
      details: 'Unlimited vs limited would need plan-based rate limiting'
    };
  },

  "Unlimited Deeper Dives": () => {
    // Check for deeper dive feature
    let deeperDiveFiles = 0;
    try {
      const srcDir = path.join(PROJECT_ROOT, 'src');
      const checkDir = (dir) => {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            checkDir(fullPath);
          } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('deeper') && content.includes('dive')) {
              deeperDiveFiles++;
            }
          }
        }
      };
      checkDir(srcDir);
    } catch (e) {}
    
    return {
      implemented: deeperDiveFiles > 0,
      evidence: deeperDiveFiles > 0 ? `✅ ${deeperDiveFiles} deeper dive files found` : '❌ No deeper dive feature',
      details: 'Check explore page for deeper dive functionality'
    };
  },

  "Unlimited AI Interview prep sessions": () => {
    // Check interview prep
    const interviewDir = path.join(PROJECT_ROOT, 'src/app/interview-prep');
    const hasInterviewDir = fs.existsSync(interviewDir);
    
    let interviewFiles = 0;
    if (hasInterviewDir) {
      try {
        const files = fs.readdirSync(interviewDir);
        interviewFiles = files.filter(f => f.endsWith('.tsx') || f.endsWith('.ts')).length;
      } catch (e) {}
    }
    
    return {
      implemented: hasInterviewDir && interviewFiles > 0,
      evidence: hasInterviewDir ? '✅ Interview prep directory exists' : '❌ No interview prep',
      details: `Found ${interviewFiles} interview prep files`
    };
  },

  "Priority PM Jobs board access": () => {
    // Check jobs board
    let jobsBoardFiles = 0;
    try {
      const srcDir = path.join(PROJECT_ROOT, 'src');
      const checkDir = (dir) => {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            checkDir(fullPath);
          } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('job') && (content.includes('board') || content.includes('career'))) {
              jobsBoardFiles++;
            }
          }
        }
      };
      checkDir(srcDir);
    } catch (e) {}
    
    return {
      implemented: jobsBoardFiles > 0,
      evidence: jobsBoardFiles > 0 ? `✅ ${jobsBoardFiles} jobs board files found` : '❌ No jobs board',
      details: 'Priority access would need plan-based filtering'
    };
  },

  "Exclusive WhatsApp PM community": () => {
    // Check for community/WhatsApp references
    let communityFiles = 0;
    try {
      const srcDir = path.join(PROJECT_ROOT, 'src');
      const checkDir = (dir) => {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            checkDir(fullPath);
          } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('community') || content.includes('whatsapp') || content.includes('WhatsApp')) {
              communityFiles++;
            }
          }
        }
      };
      checkDir(srcDir);
    } catch (e) {}
    
    return {
      implemented: communityFiles > 0,
      evidence: communityFiles > 0 ? `✅ ${communityFiles} community references found` : '❌ No community feature',
      details: 'Would need actual WhatsApp group link/integration'
    };
  },

  "Save Notes & Recaps": () => {
    // Check for notes/recaps system
    const schema = fs.readFileSync(path.join(PROJECT_ROOT, 'prisma/schema.prisma'), 'utf8');
    const hasNotes = schema.includes('Note') || schema.includes('notes');
    
    return {
      implemented: hasNotes,
      evidence: hasNotes ? '✅ Notes system in schema' : '❌ No notes system',
      details: 'Check for Note model or similar'
    };
  },

  "Personalized learning roadmap": () => {
    // Check for roadmap/planning
    let roadmapFiles = 0;
    try {
      const srcDir = path.join(PROJECT_ROOT, 'src');
      const checkDir = (dir) => {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            checkDir(fullPath);
          } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('roadmap') || content.includes('plan') || content.includes('learningPath')) {
              roadmapFiles++;
            }
          }
        }
      };
      checkDir(srcDir);
    } catch (e) {}
    
    return {
      implemented: roadmapFiles > 0,
      evidence: roadmapFiles > 0 ? `✅ ${roadmapFiles} roadmap files found` : '❌ No roadmap feature',
      details: 'Personalization would need user-specific logic'
    };
  },

  "Certificate of completion": () => {
    // Check for certificate system
    let certificateFiles = 0;
    try {
      const srcDir = path.join(PROJECT_ROOT, 'src');
      const checkDir = (dir) => {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            checkDir(fullPath);
          } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('certificate') || content.includes('completion')) {
              certificateFiles++;
            }
          }
        }
      };
      checkDir(srcDir);
    } catch (e) {}
    
    return {
      implemented: certificateFiles > 0,
      evidence: certificateFiles > 0 ? `✅ ${certificateFiles} certificate files found` : '❌ No certificate system',
      details: 'Would need PDF generation or similar'
    };
  },

  "Priority email support": () => {
    // Check for support system
    let supportFiles = 0;
    try {
      const srcDir = path.join(PROJECT_ROOT, 'src');
      const checkDir = (dir) => {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            checkDir(fullPath);
          } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('support') || content.includes('help') || content.includes('contact')) {
              supportFiles++;
            }
          }
        }
      };
      checkDir(srcDir);
    } catch (e) {}
    
    return {
      implemented: supportFiles > 0,
      evidence: supportFiles > 0 ? `✅ ${supportFiles} support files found` : '❌ No support system',
      details: 'Priority vs regular would need plan-based routing'
    };
  },

  "30-day money-back guarantee": () => {
    // This is just a policy claim
    return {
      implemented: true, // Policy doesn't need code
      evidence: '✅ Policy claim (no code needed)',
      details: 'Would need refund processing if implemented'
    };
  }
};

// Run the analysis
console.log('=== PM STREAK FEATURE REALITY CHECK ===');
console.log('Methodology: gstack investigate');
console.log(`Date: ${new Date().toISOString().split('T')[0]}`);
console.log('');

console.log('📊 FREE TIER FEATURES:');
console.log('='.repeat(50));
FEATURES.free.forEach((feature, index) => {
  const check = featureChecks[feature] ? featureChecks[feature]() : { implemented: false, evidence: '❌ No check defined', details: '' };
  console.log(`${index + 1}. ${feature}`);
  console.log(`   Status: ${check.implemented ? '✅ IMPLEMENTED' : '❌ NOT IMPLEMENTED'}`);
  console.log(`   Evidence: ${check.evidence}`);
  console.log(`   Details: ${check.details}`);
  console.log('');
});

console.log('\n📊 PRO TIER FEATURES:');
console.log('='.repeat(50));
FEATURES.pro.forEach((feature, index) => {
  const check = featureChecks[feature] ? featureChecks[feature]() : { implemented: false, evidence: '❌ No check defined', details: '' };
  console.log(`${index + 1}. ${feature}`);
  console.log(`   Status: ${check.implemented ? '✅ IMPLEMENTED' : '❌ NOT IMPLEMENTED'}`);
  console