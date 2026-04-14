import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks (must be hoisted above imports) ────────────────────────────────────
const mockFindUnique = vi.fn();
const mockFindMany = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...a: any[]) => mockFindUnique(...a) },
    category: { findMany: (...a: any[]) => mockFindMany(...a) },
    completedLesson: { findMany: vi.fn().mockResolvedValue([]) },
  },
}));
vi.mock("@/lib/billing/upi-india-server", () => ({
  expireStaleUpiAndReconcileUser: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/entitlements", () => ({
  isUserPro: vi.fn(),
}));

import { FREE_LESSONS_PER_CATEGORY, PRO_GATE_REASON, getCoreCurriculumForUser } from "@/lib/lesson-access";
import { isUserPro } from "@/lib/entitlements";

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeLesson(dayNumber: number, extra: Record<string, unknown> = {}) {
  return {
    id: `l${dayNumber}`,
    title: `Lesson ${dayNumber}`,
    slug: `lesson-${dayNumber}`,
    description: "",
    content: "",
    xpReward: 10,
    difficulty: 1,
    dayNumber,
    isLocked: false,
    aiGenerated: false,
    generatedForUserId: null,
    topicKey: null,
    generationMode: null,
    sourceLessonId: null,
    type: null,
    promptText: null,
    skillTags: [],
    youtubeId: null,
    youtubeStart: null,
    youtubeEnd: null,
    guestName: null,
    episodeTitle: null,
    sourceTranscript: null,
    createdAt: new Date(),
    questions: [],
    completedLessons: [],
    ...extra,
  };
}

function makeCategory(slug: string, lessonCount: number) {
  return {
    id: `cat-${slug}`,
    name: slug,
    slug,
    description: "",
    icon: "📚",
    color: "#58cc02",
    lessons: Array.from({ length: lessonCount }, (_, i) => makeLesson(i + 1)),
  };
}

function makeFreeUser() {
  return {
    id: "user1",
    plan: "free",
    trialEndsAt: null,
    renewsAt: null,
    unlockedBatch: 0,
    credits: 10,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe("FREE_LESSONS_PER_CATEGORY constant", () => {
  it("is 7", () => {
    expect(FREE_LESSONS_PER_CATEGORY).toBe(7);
  });
});

describe("PRO_GATE_REASON constant", () => {
  it("is UPGRADE_TO_PRO", () => {
    expect(PRO_GATE_REASON).toBe("UPGRADE_TO_PRO");
  });
});

describe("getCoreCurriculumForUser — free tier enforcement", () => {
  beforeEach(() => {
    vi.mocked(isUserPro).mockResolvedValue(false);
    mockFindUnique.mockResolvedValue(makeFreeUser());
  });

  it("free user sees exactly 7 lessons in a 20-lesson category", async () => {
    mockFindMany.mockResolvedValue([makeCategory("product-strategy", 20)]);
    const result = await getCoreCurriculumForUser("user1");
    const cat = result[0];
    expect(cat.lessons.length).toBe(7);
    expect(cat.proGatedCount).toBe(13);
  });

  it("free user sees all lessons when category has fewer than 7", async () => {
    mockFindMany.mockResolvedValue([makeCategory("pricing", 4)]);
    const result = await getCoreCurriculumForUser("user1");
    const cat = result[0];
    expect(cat.lessons.length).toBe(4);
    expect(cat.proGatedCount).toBe(0);
  });

  it("pm-leader-* categories are fully gated (0 free lessons)", async () => {
    mockFindMany.mockResolvedValue([makeCategory("pm-leader-shreyas-doshi", 5)]);
    const result = await getCoreCurriculumForUser("user1");
    const cat = result[0];
    expect(cat.lessons.length).toBe(0);
    expect(cat.proGatedCount).toBe(5);
  });

  it("pro user sees all lessons in a 20-lesson category", async () => {
    vi.mocked(isUserPro).mockResolvedValue(true);
    mockFindUnique.mockResolvedValue({ ...makeFreeUser(), plan: "pro" });
    mockFindMany.mockResolvedValue([makeCategory("product-strategy", 20)]);
    const result = await getCoreCurriculumForUser("user1");
    const cat = result[0];
    expect(cat.lessons.length).toBe(20);
    expect(cat.proGatedCount).toBe(0);
  });
});
