"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function logAdminAction(action: string, targetTable?: string, targetId?: string, details?: object) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("admin_logs").insert({
    admin_user_id: user.id,
    action,
    target_table: targetTable,
    target_id: targetId,
    details: details ?? {},
  });
}

export async function createCourse(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: language } = await supabase
    .from("languages")
    .select("id")
    .eq("code", String(formData.get("language_code")))
    .single();
  if (!language) return { error: "Unknown language code" };

  const { data, error } = await supabase
    .from("courses")
    .insert({
      language_id: language.id,
      mode: String(formData.get("mode")),
      title: String(formData.get("title")),
      description: String(formData.get("description") ?? ""),
      level: String(formData.get("level") ?? "beginner"),
      is_published: formData.get("is_published") === "on",
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  await logAdminAction("create_course", "courses", data.id, { title: formData.get("title") });
  revalidatePath("/admin");
  return { success: true };
}

export async function togglePublishCourse(courseId: string, current: boolean) {
  const supabase = await createClient();
  await supabase.from("courses").update({ is_published: !current }).eq("id", courseId);
  await logAdminAction(current ? "unpublish_course" : "publish_course", "courses", courseId);
  revalidatePath("/admin");
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", userId);
  await logAdminAction("update_role", "profiles", userId, { role });
  revalidatePath("/admin");
}
