"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, ArrowRight, Trophy } from "lucide-react";
import YouTubeEmbed from "./YouTubeEmbed";

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
}

interface QuizViewProps {
  lessonTitle: string;
  content: string;
  questions: Question[];
  xpReward: number;
  youtubeId?: string | null;
  youtubeStart?: number | null;
  youtubeEnd?: number | null;
  guestName?: string | null;
  episodeTitle?: string | null;
  onComplete: (answers: { questionId: string; selectedIndex: number }[]) => void;
}

type Phase = "lesson" | "quiz" | "result";

export default function QuizView({ lessonTitle, content, questions, xpReward, youtubeId, youtubeStart, youtubeEnd, guestName, episodeTitle, onComplete }: QuizViewProps) {
  const [phase, setPhase] = useState<Phase>("lesson");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; selectedIndex: number }[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [showXPPop, setShowXPPop] = useState(false);

  const question = questions[currentQ];
  const isCorrect = selected === question?.correctIndex;
  const progress = phase === "lesson" ? 0 : ((currentQ + (confirmed ? 1 : 0)) / questions.length) * 100;

  const handleConfirm = useCallback(() => {
    if (selected === null) return;

    setConfirmed(true);
    const newAnswers = [...answers, { questionId: question.id, selectedIndex: selected }];
    setAnswers(newAnswers);

    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setXpGained((x) => x + question.xpReward);
      setShowXPPop(true);
      setTimeout(() => setShowXPPop(false), 1000);
    }
  }, [selected, answers, question, isCorrect]);

  const handleNext = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setPhase("result");
      onComplete(answers);
    }
  }, [currentQ, questions.length, answers, onComplete]);

  if (phase === "lesson") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-xl font-bold">{lessonTitle}</h1>

        {youtubeId && (
          <YouTubeEmbed
            videoId={youtubeId}
            startTime={youtubeStart ?? undefined}
            endTime={youtubeEnd ?? undefined}
            guestName={guestName ?? undefined}
            episodeTitle={episodeTitle ?? undefined}
          />
        )}

        <div className="bg-[var(--bg-card)] rounded-2xl p-6 text-sm leading-relaxed whitespace-pre-line text-[var(--text-secondary)]">
          {content}
        </div>
        <button
          onClick={() => setPhase("quiz")}
          className="w-full py-3 rounded-2xl bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
        >
          Start Quiz <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  if (phase === "result") {
    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const totalXP = xpGained + xpReward;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto px-4 py-12 text-center"
      >
        <div className="mb-6">
          <Trophy size={64} className="mx-auto text-[var(--gold-primary)] mb-4" />
          <h1 className="text-2xl font-bold mb-2">Lesson Complete!</h1>
          <p className="text-[var(--text-secondary)]">
            {score >= 80 ? "Amazing work!" : score >= 50 ? "Good job!" : "Keep practicing!"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[var(--bg-card)] rounded-2xl p-4">
            <div className="text-3xl font-bold text-[var(--green-primary)]">{score}%</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Score</div>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl p-4">
            <div className="text-3xl font-bold text-[var(--gold-primary)] flex items-center justify-center gap-1">
              <Zap size={24} /> {totalXP}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">XP Earned</div>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl p-4">
            <div className="text-3xl font-bold text-[var(--blue-primary)]">
              {correctCount}/{questions.length}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Correct</div>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl p-4">
            <div className="text-3xl font-bold text-[var(--purple-primary)]">
              {questions.length}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Questions</div>
          </div>
        </div>

        <a
          href="/dashboard"
          className="block w-full py-3 rounded-2xl bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white font-bold text-sm uppercase tracking-wide transition-colors"
        >
          Continue Learning
        </a>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Progress bar */}
      <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-[var(--green-primary)] rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="text-xs text-[var(--text-secondary)] mb-4">
        Question {currentQ + 1} of {questions.length}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-lg font-bold mb-6">{question.questionText}</h2>

          <div className="space-y-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => !confirmed && setSelected(i)}
                disabled={confirmed}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border-2 transition-all text-sm font-medium",
                  !confirmed && selected === i
                    ? "border-[var(--blue-primary)] bg-[var(--blue-primary)]/10"
                    : !confirmed
                    ? "border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--text-secondary)]"
                    : confirmed && i === question.correctIndex
                    ? "border-[var(--green-primary)] bg-[var(--green-primary)]/10"
                    : confirmed && selected === i && !isCorrect
                    ? "border-[var(--red-primary)] bg-[var(--red-primary)]/10"
                    : "border-[var(--border-color)] bg-[var(--bg-card)] opacity-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0",
                      !confirmed && selected === i
                        ? "border-[var(--blue-primary)] text-[var(--blue-primary)]"
                        : confirmed && i === question.correctIndex
                        ? "border-[var(--green-primary)] bg-[var(--green-primary)] text-white"
                        : confirmed && selected === i && !isCorrect
                        ? "border-[var(--red-primary)] bg-[var(--red-primary)] text-white"
                        : "border-[var(--border-color)] text-[var(--text-secondary)]"
                    )}
                  >
                    {confirmed && i === question.correctIndex ? (
                      <Check size={14} />
                    ) : confirmed && selected === i && !isCorrect ? (
                      <X size={14} />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {confirmed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-4 p-4 rounded-2xl text-sm",
                isCorrect
                  ? "bg-[var(--green-primary)]/10 border border-[var(--green-primary)]/30"
                  : "bg-[var(--red-primary)]/10 border border-[var(--red-primary)]/30"
              )}
            >
              <div className="font-bold mb-1 flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <Check size={16} className="text-[var(--green-primary)]" /> Correct!
                  </>
                ) : (
                  <>
                    <X size={16} className="text-[var(--red-primary)]" /> Incorrect
                  </>
                )}
              </div>
              <p className="text-[var(--text-secondary)]">{question.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* XP Pop */}
      <AnimatePresence>
        {showXPPop && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 text-[var(--gold-primary)] font-bold text-xl flex items-center gap-1"
          >
            <Zap size={20} /> +{question.xpReward} XP
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6">
        {!confirmed ? (
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            className={cn(
              "w-full py-3 rounded-2xl font-bold text-sm uppercase tracking-wide transition-colors",
              selected !== null
                ? "bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-not-allowed"
            )}
          >
            Check
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-2xl bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            {currentQ < questions.length - 1 ? (
              <>Continue <ArrowRight size={16} /></>
            ) : (
              <>Finish <Trophy size={16} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
