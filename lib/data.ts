import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/database";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data as Profile | null;
}

export async function getDashboardData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: progress }, { data: goal }, { data: courses }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("lesson_progress")
        .select("*, lessons(title, unit_id, units(title, course_id, courses(title, mode, language_id, languages(name, flag_emoji))))")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(5),
      supabase
        .from("daily_goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("goal_date", new Date().toISOString().slice(0, 10))
        .maybeSingle(),
      supabase
        .from("courses")
        .select("*, languages(name, flag_emoji)")
        .eq("is_published", true)
        .order("order_index"),
    ]);

  return { profile: profile as Profile | null, recentProgress: progress ?? [], goal, courses: courses ?? [] };
}

export async function getCoursesByMode(mode: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*, languages(name, flag_emoji, code)")
    .eq("mode", mode)
    .eq("is_published", true)
    .order("order_index");
  return data ?? [];
}

export async function getCourseWithUnits(courseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: course }, { data: units }, { data: progress }] = await Promise.all([
    supabase.from("courses").select("*, languages(name, flag_emoji)").eq("id", courseId).single(),
    supabase
      .from("units")
      .select("*, lessons(*)")
      .eq("course_id", courseId)
      .order("order_index"),
    user
      ? supabase.from("lesson_progress").select("lesson_id, status, score").eq("user_id", user.id)
      : Promise.resolve({ data: [] }),
  ]);

  return { course, units: units ?? [], progress: progress ?? [] };
}

export async function getLessonWithExercises(lessonId: string) {
  const supabase = await createClient();
  const [{ data: lesson }, { data: exercises }] = await Promise.all([
    supabase
      .from("lessons")
      .select("*, units(title, course_id, courses(title, mode, language_id))")
      .eq("id", lessonId)
      .single(),
    supabase.from("exercises").select("*").eq("lesson_id", lessonId).order("order_index"),
  ]);
  return { lesson, exercises: exercises ?? [] };
}

export async function getVocabulary(languageCode?: string) {
  const supabase = await createClient();
  let query = supabase.from("vocabulary_words").select("*, languages(code, name, flag_emoji)").order("word");
  if (languageCode) query = query.eq("languages.code", languageCode);
  const { data } = await query.limit(200);
  return data ?? [];
}

export async function getSavedWords() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("saved_words")
    .select("*, vocabulary_words(*, languages(code, name, flag_emoji))")
    .eq("user_id", user.id)
    .order("next_review_at");
  return data ?? [];
}

export async function getProgressAnalytics() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: progress }, { data: quizAttempts }, { data: achievements }, { data: profile }] =
    await Promise.all([
      supabase.from("lesson_progress").select("status, score, completed_at").eq("user_id", user.id),
      supabase.from("quiz_attempts").select("is_correct, attempted_at").eq("user_id", user.id),
      supabase.from("user_achievements").select("earned_at, achievements(title, icon, description)").eq("user_id", user.id),
      supabase.from("profiles").select("xp, current_streak, longest_streak").eq("id", user.id).single(),
    ]);

  return {
    progress: progress ?? [],
    quizAttempts: quizAttempts ?? [],
    achievements: achievements ?? [],
    profile,
  };
}

export async function getChatSessions() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function getChatMessages(sessionId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at");
  return data ?? [];
}

export async function getNotifications() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);
  return data ?? [];
}

export async function isAdminOrTeacher() {
  const profile = await getProfile();
  return profile?.role === "admin" || profile?.role === "teacher";
}
