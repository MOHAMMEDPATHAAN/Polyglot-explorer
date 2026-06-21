"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Passage {
  id: string;
  title: string;
  flag: string;
  level: string;
  text: string;
  questions: { q: string; options: string[]; answer: string }[];
}

const PASSAGES: Passage[] = [
  {
    id: "es-cafe",
    title: "En el café",
    flag: "🇪🇸",
    level: "Beginner",
    text: "Hola, me llamo Ana. Cada mañana voy a un café cerca de mi casa. Pido un café con leche y un croissant. Hablo con el camarero en español. Es una buena manera de practicar cada día.",
    questions: [
      {
        q: "What does Ana order?",
        options: ["Tea and toast", "Coffee with milk and a croissant", "Orange juice"],
        answer: "Coffee with milk and a croissant",
      },
      {
        q: "Why does she talk to the waiter?",
        options: ["To complain", "To practice Spanish", "To order in English"],
        answer: "To practice Spanish",
      },
    ],
  },
  {
    id: "en-meeting",
    title: "Rescheduling a meeting",
    flag: "🇬🇧",
    level: "Business",
    text: "Hi team, due to a scheduling conflict, I need to move tomorrow's 10am meeting to 2pm. Please let me know if this new time works for everyone. I've attached the updated agenda. Thanks for your flexibility.",
    questions: [
      {
        q: "What time is the meeting moving to?",
        options: ["9am", "2pm", "5pm"],
        answer: "2pm",
      },
      {
        q: "What was attached to the message?",
        options: ["The updated agenda", "A invoice", "A travel itinerary"],
        answer: "The updated agenda",
      },
    ],
  },
  {
    id: "fr-marche",
    title: "Au marché",
    flag: "🇫🇷",
    level: "Beginner",
    text: "Le samedi matin, je vais au marché avec ma mère. Nous achetons des fruits, des légumes et du fromage. Le marché est très animé et coloré. J'aime parler avec les vendeurs.",
    questions: [
      {
        q: "When do they go to the market?",
        options: ["Saturday morning", "Sunday evening", "Friday night"],
        answer: "Saturday morning",
      },
    ],
  },
];

export function ReadingPractice() {
  const [activeId, setActiveId] = useState(PASSAGES[0].id);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<Record<number, string>>({});

  const passage = PASSAGES.find((p) => p.id === activeId)!;

  function selectAnswer(qIndex: number, option: string) {
    if (revealed[qIndex]) return;
    setSelected((s) => ({ ...s, [qIndex]: option }));
    setRevealed((r) => ({ ...r, [qIndex]: true }));
  }

  function switchPassage(id: string) {
    setActiveId(id);
    setRevealed({});
    setSelected({});
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex gap-2 flex-wrap">
        {PASSAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => switchPassage(p.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-sm border transition-colors",
              activeId === p.id ? "bg-accent text-white border-accent" : "border-surface-line text-muted"
            )}
          >
            {p.flag} {p.title}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="font-display text-xl font-semibold">{passage.title}</p>
          <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-surface-line text-muted">
            {passage.level}
          </span>
        </div>
        <p className="text-sm leading-7">
          {passage.text.split(" ").map((word, i) => (
            <Link
              key={i}
              href={`/dictionary?q=${encodeURIComponent(word.replace(/[.,!?]/g, ""))}`}
              className="hover:text-accent hover:underline decoration-dotted underline-offset-2"
            >
              {word}{" "}
            </Link>
          ))}
        </p>
        <p className="text-[11px] text-muted mt-3">Tap any word to look it up in the Dictionary.</p>
      </Card>

      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Comprehension</h2>
        {passage.questions.map((q, qIndex) => (
          <Card key={qIndex}>
            <p className="text-sm font-medium mb-3">{q.q}</p>
            <div className="grid gap-2">
              {q.options.map((opt) => {
                const isSelected = selected[qIndex] === opt;
                const isCorrect = opt === q.answer;
                const show = revealed[qIndex];
                return (
                  <button
                    key={opt}
                    onClick={() => selectAnswer(qIndex, opt)}
                    className={cn(
                      "text-left px-3.5 py-2.5 rounded-xl border text-sm transition-colors",
                      !show && "border-surface-line hover:border-accent/40",
                      show && isCorrect && "border-teal bg-teal/10 text-teal",
                      show && isSelected && !isCorrect && "border-accent bg-accent/10 text-accent"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
