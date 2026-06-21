"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, CheckCircle2, XCircle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Exercise, Lesson } from "@/lib/types/database";

type Attempt = { exerciseId: string; answerGiven: string; isCorrect: boolean };

export function LessonPlayer({
  lesson,
  exercises,
  courseId,
}: {
  lesson: Lesson;
  exercises: Exercise[];
  courseId: string;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ scorePct: number; xpEarned: number; newStreak: number } | null>(
    null
  );

  const exercise = exercises[index];
  const progressPct = Math.round((index / Math.max(1, exercises.length)) * 100);

  function speak(text: string) {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
    }
  }

  function choose(option: string) {
    if (revealed) return;
    setSelected(option);
  }

  function submit() {
    if (!selected || revealed) return;
    const isCorrect = selected === exercise.correct_answer;
    setAttempts((prev) => [...prev, { exerciseId: exercise.id, answerGiven: selected, isCorrect }]);
    setRevealed(true);
  }

  async function next() {
    if (index + 1 < exercises.length) {
      setIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setFinished(true);
      setSaving(true);
      const correctCount = attempts.filter((a) => a.isCorrect).length;
      try {
        const res = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: lesson.id,
            xpReward: lesson.xp_reward,
            correctCount,
            totalCount: exercises.length,
            attempts,
          }),
        });
        const data = await res.json();
        setResult(data);
      } finally {
        setSaving(false);
      }
    }
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-muted">This lesson doesn&apos;t have any exercises yet.</p>
        <Link href={`/learn/course/${courseId}`} className="text-accent hover:underline text-sm">
          Back to course
        </Link>
      </div>
    );
  }

  if (finished) {
    const correctCount = attempts.filter((a) => a.isCorrect).length;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
        <div className="stamp w-24 h-24 text-accent text-2xl font-display">
          {result ? `${result.scorePct}%` : "…"}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">Lesson complete!</h1>
          <p className="text-muted text-sm mt-1">
            {correctCount} / {exercises.length} correct
            {result ? ` · +${result.xpEarned} XP · ${result.newStreak}-day streak` : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/learn/course/${courseId}`}>
            <Button variant="secondary">Back to course</Button>
          </Link>
          <Link href="/dashboard">
            <Button disabled={saving}>{saving ? "Saving…" : "Go to dashboard"}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const options: string[] = Array.isArray(exercise.options) ? exercise.options : [];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-4 p-4 border-b border-surface-line">
        <button
          onClick={() => router.push(`/learn/course/${courseId}`)}
          className="text-muted hover:text-foreground"
          aria-label="Exit lesson"
        >
          <X size={22} />
        </button>
        <div className="flex-1 h-2 rounded-full bg-surface overflow-hidden">
          <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="text-xs font-mono text-muted">
          {index + 1}/{exercises.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <p className="text-xs uppercase tracking-wide text-accent font-medium mb-2">
            {exercise.type.replace("_", " ")}
          </p>
          <div className="flex items-start gap-2 mb-8">
            <h2 className="font-display text-2xl font-semibold leading-snug">{exercise.prompt}</h2>
            <button
              onClick={() => speak(exercise.prompt)}
              className="text-muted hover:text-accent mt-1 shrink-0"
              aria-label="Listen"
            >
              <Volume2 size={18} />
            </button>
          </div>

          <div className="grid gap-3">
            {options.map((option) => {
              const isCorrectOption = option === exercise.correct_answer;
              const isSelected = option === selected;
              return (
                <button
                  key={option}
                  onClick={() => choose(option)}
                  disabled={revealed}
                  className={cn(
                    "flex items-center justify-between text-left px-4 py-3.5 rounded-xl border text-sm transition-colors",
                    !revealed && isSelected && "border-accent bg-accent/10",
                    !revealed && !isSelected && "border-surface-line hover:border-accent/40",
                    revealed && isCorrectOption && "border-teal bg-teal/10 text-teal",
                    revealed && isSelected && !isCorrectOption && "border-accent bg-accent/10 text-accent"
                  )}
                >
                  {option}
                  {revealed && isCorrectOption && <CheckCircle2 size={18} />}
                  {revealed && isSelected && !isCorrectOption && <XCircle size={18} />}
                </button>
              );
            })}
          </div>

          {revealed && exercise.explanation && (
            <p className="mt-4 text-sm text-muted bg-surface border border-surface-line rounded-xl p-3.5">
              {exercise.explanation}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-surface-line flex justify-end">
        {!revealed ? (
          <Button onClick={submit} disabled={!selected} size="lg">
            Check answer
          </Button>
        ) : (
          <Button onClick={next} size="lg">
            {index + 1 < exercises.length ? "Continue" : "Finish lesson"}
          </Button>
        )}
      </div>
    </div>
  );
}
