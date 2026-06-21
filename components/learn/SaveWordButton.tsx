"use client";

import { useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { saveWord, unsaveWord } from "@/lib/actions/vocabulary";
import { cn } from "@/lib/utils";

export function SaveWordButton({ wordId, saved }: { wordId: string; saved: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(() => {
          if (saved) unsaveWord(wordId);
          else saveWord(wordId);
        })
      }
      disabled={pending}
      className={cn(
        "p-1.5 rounded-lg transition-colors",
        saved ? "text-accent" : "text-muted hover:text-accent"
      )}
      aria-label={saved ? "Remove from saved words" : "Save word"}
    >
      {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
    </button>
  );
}
