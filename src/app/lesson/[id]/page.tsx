"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import QuizView from "@/components/QuizView";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LessonData {
  id: string;
  title: string;
  content: string;
  xpReward: number;
  category: { name: string; icon: string };
  questions: {
    id: string;
    questionText: string;
    questionType: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    xpReward: number;
  }[];
  completed: boolean;
  previousScore: number | null;
}

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/lessons/${id}`);
        if (!res.ok) {
          router.push("/dashboard");
          return;
        }
        const data = await res.json();
        setLesson(data.lesson);
      } catch {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const handleComplete = useCallback(
    async (answers: { questionId: string; selectedIndex: number }[]) => {
      if (!lesson || completed) return;
      setCompleted(true);

      try {
        await fetch(`/api/lessons/${id}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score: answers.filter((a) => {
              const q = lesson.questions.find((q) => q.id === a.questionId);
              return q && q.correctIndex === a.selectedIndex;
            }).length,
            answers,
          }),
        });
      } catch (err) {
        console.error("Failed to save completion:", err);
      }
    },
    [lesson, id, completed]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--green-primary)] text-lg font-bold">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="text-[var(--text-secondary)] hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[var(--text-secondary)]">
              {lesson.category.icon} {lesson.category.name}
            </div>
            <h1 className="text-sm font-bold truncate">{lesson.title}</h1>
          </div>
        </div>
      </header>

      <QuizView
        lessonTitle={lesson.title}
        content={lesson.content}
        questions={lesson.questions}
        xpReward={lesson.xpReward}
        onComplete={handleComplete}
      />
    </div>
  );
}
