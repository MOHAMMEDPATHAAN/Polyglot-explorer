"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const targetLanguages = String(formData.get("target_languages") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const update = {
    display_name: String(formData.get("display_name") ?? ""),
    username: String(formData.get("username") ?? "") || null,
    bio: String(formData.get("bio") ?? "") || null,
    native_language: String(formData.get("native_language") ?? "en"),
    target_languages: targetLanguages,
    current_skill_level: String(formData.get("current_skill_level") ?? "beginner"),
    learning_goals: String(formData.get("learning_goals") ?? "") || null,
    preferred_mode: String(formData.get("preferred_mode") ?? "educational"),
    timezone: String(formData.get("timezone") ?? "UTC"),
    avatar_url: String(formData.get("avatar_url") ?? "") || null,
  };

  await supabase.from("profiles").update(update).eq("id", user.id);
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase
    .from("profiles")
    .update({
      theme_preference: String(formData.get("theme_preference") ?? "system"),
      daily_time_limit_minutes: formData.get("daily_time_limit_minutes")
        ? Number(formData.get("daily_time_limit_minutes"))
        : null,
    })
    .eq("id", user.id);

  revalidatePath("/settings");
  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Deletes the profile row; auth.users deletion requires the service role key
  // and should be triggered from a privileged server context (see README).
  await supabase.from("profiles").update({ is_active: false }).eq("id", user.id);
  await supabase.auth.signOut();
  return { success: true };
}
