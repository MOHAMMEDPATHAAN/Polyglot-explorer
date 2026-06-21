import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSavedWords, getCurrentUser } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SaveWordButton } from "@/components/learn/SaveWordButton";
import { FlashcardReview } from "@/components/learn/FlashcardReview";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";

export default async function DictionaryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tab?: string }>;
}) {
  const { q, tab } = await searchParams;
  const activeTab = tab === "mine" ? "mine" : "browse";
  const supabase = await createClient();
  const user = await getCurrentUser();

  let query = supabase
    .from("vocabulary_words")
    .select("*, languages(code, name, flag_emoji)")
    .order("word")
    .limit(60);
  if (q) query = query.or(`word.ilike.%${q}%,translation.ilike.%${q}%`);
  const { data: words } = await query;

  const savedWords = user ? await getSavedWords() : [];
  const savedIds = new Set(savedWords.map((w: any) => w.word_id));
  const dueWords = savedWords.filter((w: any) => w.next_review_at <= new Date().toISOString().slice(0, 10));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Dictionary</h1>
        <p className="text-muted text-sm mt-1">Search words, save them, and review with flashcards.</p>
      </div>

      <div className="flex gap-2">
        <Link
          href="/dictionary?tab=browse"
          className={cn(
            "px-4 py-2 rounded-full text-sm border transition-colors",
            activeTab === "browse" ? "bg-accent text-white border-accent" : "border-surface-line text-muted"
          )}
        >
          Browse
        </Link>
        <Link
          href="/dictionary?tab=mine"
          className={cn(
            "px-4 py-2 rounded-full text-sm border transition-colors",
            activeTab === "mine" ? "bg-accent text-white border-accent" : "border-surface-line text-muted"
          )}
        >
          My Words ({savedWords.length}) {dueWords.length > 0 && `· ${dueWords.length} due`}
        </Link>
      </div>

      {activeTab === "browse" && (
        <>
          <form className="max-w-sm">
            <Input name="q" defaultValue={q} placeholder="Search hola, merci, gato…" />
          </form>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(words ?? []).map((word: any) => (
              <Card key={word.id} className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{word.languages?.flag_emoji}</span>
                    <p className="font-display text-lg font-semibold">{word.word}</p>
                  </div>
                  {user && <SaveWordButton wordId={word.id} saved={savedIds.has(word.id)} />}
                </div>
                <p className="text-accent text-sm font-medium">{word.translation}</p>
                {word.example_sentence && (
                  <p className="text-xs text-muted italic">&ldquo;{word.example_sentence}&rdquo;</p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] uppercase tracking-wide text-muted">
                    {word.difficulty_level?.replace("_", " ")}
                  </span>
                </div>
              </Card>
            ))}
            {(!words || words.length === 0) && (
              <Card className="sm:col-span-2 lg:col-span-3 text-center py-12">
                <p className="text-muted text-sm">No words match &ldquo;{q}&rdquo;.</p>
              </Card>
            )}
          </div>
        </>
      )}

      {activeTab === "mine" && <FlashcardReview words={dueWords.length ? dueWords : (savedWords as any)} />}
    </div>
  );
}
