import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const [profile, progress, savedWords, achievements, quizAttempts] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("lesson_progress").select("*").eq("user_id", user.id),
    supabase.from("saved_words").select("*, vocabulary_words(word, translation)").eq("user_id", user.id),
    supabase.from("user_achievements").select("*, achievements(title)").eq("user_id", user.id),
    supabase.from("quiz_attempts").select("*").eq("user_id", user.id),
  ]);

  const payload = {
    exported_at: new Date().toISOString(),
    profile: profile.data,
    lesson_progress: progress.data,
    saved_words: savedWords.data,
    achievements: achievements.data,
    quiz_attempts: quizAttempts.data,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=polyglot-explorer-data.json",
    },
  });
}
