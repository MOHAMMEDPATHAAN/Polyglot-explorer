"use client";

import { useState } from "react";
import { Volume2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { reviewWord } from "@/lib/actions/vocabulary";
import type { SavedWord } from "@/lib/types/database";

export function FlashcardReview({ words }: { words: SavedWord[] }) {
  const [queue, setQueue] = useState(words);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (queue.length === 0) {
    return (
      <Card className="text-center py-16">
        <p className="text-muted text-sm">
          Nothing due for review right now. Save more words from the Browse tab, or come back later.
        </p>
      </Card>
    );
  }

  if (index >= queue.length) {
    return (
      <Card className="text-center py-16 space-y-3">
        <p className="font-display text-xl font-semibold">All caught up! 🎉</p>
        <p className="text-muted text-sm">You reviewed {queue.length} words.</p>
        <Button
          variant="secondary"
          onClick={() => {
            setIndex(0);
            setFlipped(false);
          }}
        >
          <RotateCcw size={16} /> Review again
        </Button>
      </Card>
    );
  }

  const item = queue[index];
  const word = item.vocabulary_words!;

  function speak() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(word.word));
    }
  }

  function mark(remembered: boolean) {
    reviewWord(item.id, remembered);
    setFlipped(false);
    setIndex((i) => i + 1);
  }

  return (
    <div className="max-w-md mx-auto space-y-5">
      <p className="text-center text-xs text-muted font-mono">
        {index + 1} / {queue.length}
      </p>
      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full"
        aria-label="Flip card"
      >
        <Card className="min-h-64 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-accent/40 transition-colors">
          {!flipped ? (
            <>
              <span className="text-3xl">{(word as any).languages?.flag_emoji}</span>
              <p className="font-display text-3xl font-semibold">{word.word}</p>
              {word.part_of_speech && <p className="text-xs text-muted uppercase tracking-wide">{word.part_of_speech}</p>}
            </>
          ) : (
            <>
              <p className="font-display text-2xl font-semibold text-accent">{word.translation}</p>
              {word.example_sentence && (
                <p className="text-sm text-muted italic max-w-xs">&ldquo;{word.example_sentence}&rdquo;</p>
              )}
            </>
          )}
          <p className="text-[11px] text-muted mt-2">Tap card to flip</p>
        </Card>
      </button>

      <div className="flex items-center justify-center gap-3">
        <Button variant="ghost" size="sm" onClick={speak}>
          <Volume2 size={16} /> Listen
        </Button>
      </div>

      {flipped && (
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => mark(false)}>
            Still learning
          </Button>
          <Button className="flex-1" onClick={() => mark(true)}>
            Got it
          </Button>
        </div>
      )}
    </div>
  );
}
