import { redirect } from "next/navigation";
import { isAdminOrTeacher } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { AdminPanel } from "@/components/dashboard/AdminPanel";

export default async function AdminPage() {
  const allowed = await isAdminOrTeacher();
  if (!allowed) redirect("/dashboard");

  const supabase = await createClient();

  const [{ count: userCount }, { count: courseCount }, { count: lessonCount }, { data: courses }, { data: users }, { data: logs }, { data: languages }] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("lessons").select("id", { count: "exact", head: true }),
      supabase
        .from("courses")
        .select("*, languages(flag_emoji)")
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("profiles")
        .select("id, display_name, xp, current_streak, role")
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("admin_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30),
      supabase.from("languages").select("code, name, flag_emoji").order("name"),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Admin</h1>
        <p className="text-muted text-sm mt-1">Manage courses, users, and review the audit log.</p>
      </div>
      <AdminPanel
        stats={{ users: userCount ?? 0, courses: courseCount ?? 0, lessons: lessonCount ?? 0 }}
        courses={courses ?? []}
        users={users ?? []}
        logs={logs ?? []}
        languages={languages ?? []}
      />
    </div>
  );
}
