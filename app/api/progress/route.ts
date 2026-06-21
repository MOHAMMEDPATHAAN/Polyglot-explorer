import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json();
  const { lessonId, xpReward, correctCount, totalCount, attempts } = body as {
    lessonId: string;
    xpReward: number;
    correctCount: number;
    totalCount: number;
    attempts: { exerciseId: string; answerGiven: string; isCorrect: boolean }[];
  };

  const scorePct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const today = new Date().toISOString().slice(0, 10);

  // 1. Upsert lesson progress
  await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      status: "completed",
      score: scorePct,
      completed_at: new Date().toISOString(),
      attempts: 1,
    },
    { onConflict: "user_id,lesson_id" }
  );

  // 2. Record quiz attempts
  if (attempts?.length) {
    await supabase.from("quiz_attempts").insert(
      attempts.map((a) => ({
        user_id: user.id,
        lesson_id: lessonId,
        exercise_id: a.exerciseId,
        answer_given: a.answerGiven,
        is_correct: a.isCorrect,
      }))
    );
  }

  // 3. Update profile XP + streak
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, current_streak, longest_streak, last_active_date")
    .eq("id", user.id)
    .single();

  let nextStreak = profile?.current_streak ?? 0;
  if (profile?.last_active_date !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    nextStreak = profile?.last_active_date === yesterday ? (profile?.current_streak ?? 0) + 1 : 1;
  }
  const nextLongest = Math.max(nextStreak, profile?.longest_streak ?? 0);

  await supabase
    .from("profiles")
    .update({
      xp: (profile?.xp ?? 0) + xpReward,
      current_streak: nextStreak,
      longest_streak: nextLongest,
      last_active_date: today,
    })
    .eq("id", user.id);

  // 4. Update today's daily goal
  const { data: existingGoal } = await supabase
    .from("daily_goals")
    .select("id, xp_earned, minutes_spent")
    .eq("user_id", user.id)
    .eq("goal_date", today)
    .maybeSingle();

  if (existingGoal) {
    await supabase
      .from("daily_goals")
      .update({ xp_earned: existingGoal.xp_earned + xpReward })
      .eq("id", existingGoal.id);
  } else {
    await supabase.from("daily_goals").insert({
      user_id: user.id,
      goal_date: today,
      xp_earned: xpReward,
    });
  }

  // 5. Achievements: first lesson + perfect score
  const { count: completedCount } = await supabase
    .from("lesson_progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed");

  const achievementSlugs: string[] = [];
  if ((completedCount ?? 0) <= 1) achievementSlugs.push("first_lesson");
  if (scorePct === 100) achievementSlugs.push("perfect_quiz");
  if (nextStreak >= 7) achievementSlugs.push("week_streak");
  if (nextStreak >= 30) achievementSlugs.push("month_streak");

  if (achievementSlugs.length) {
    const { data: achievements } = await supabase
      .from("achievements")
      .select("id, slug")
      .in("slug", achievementSlugs);

    if (achievements?.length) {
      await supabase
        .from("user_achievements")
        .upsert(
          achievements.map((a) => ({ user_id: user.id, achievement_id: a.id })),
          { onConflict: "user_id,achievement_id", ignoreDuplicates: true }
        );
    }
  }

  return NextResponse.json({ success: true, scorePct, newStreak: nextStreak, xpEarned: xpReward });
}
