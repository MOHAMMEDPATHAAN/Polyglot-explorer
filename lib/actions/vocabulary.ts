"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveWord(wordId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase.from("saved_words").upsert(
    { user_id: user.id, word_id: wordId },
    { onConflict: "user_id,word_id", ignoreDuplicates: true }
  );
  revalidatePath("/dictionary");
  return { success: true };
}

export async function unsaveWord(wordId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase.from("saved_words").delete().eq("user_id", user.id).eq("word_id", wordId);
  revalidatePath("/dictionary");
  return { success: true };
}

export async function toggleFavorite(savedWordId: string, current: boolean) {
  const supabase = await createClient();
  await supabase.from("saved_words").update({ is_favorite: !current }).eq("id", savedWordId);
  revalidatePath("/dictionary");
}

// Simple SM-2-inspired spaced repetition update
export async function reviewWord(savedWordId: string, remembered: boolean) {
  const supabase = await createClient();
  const { data: word } = await supabase
    .from("saved_words")
    .select("ease_factor, review_interval_days, times_reviewed")
    .eq("id", savedWordId)
    .single();
  if (!word) return;

  const ease = remembered ? Math.min(3, word.ease_factor + 0.1) : Math.max(1.3, word.ease_factor - 0.3);
  const interval = remembered ? Math.round(Math.max(1, word.review_interval_days) * ease) : 1;
  const nextReview = new Date(Date.now() + interval * 86400000).toISOString().slice(0, 10);

  await supabase
    .from("saved_words")
    .update({
      ease_factor: ease,
      review_interval_days: interval,
      times_reviewed: word.times_reviewed + 1,
      next_review_at: nextReview,
    })
    .eq("id", savedWordId);

  revalidatePath("/dictionary");
}
