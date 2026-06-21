"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { createCourse, togglePublishCourse, updateUserRole } from "@/lib/actions/admin";
import { MODES } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export function AdminPanel({
  stats,
  courses,
  users,
  logs,
  languages,
}: {
  stats: { users: number; courses: number; lessons: number };
  courses: any[];
  users: any[];
  logs: any[];
  languages: any[];
}) {
  const [tab, setTab] = useState<"overview" | "courses" | "users" | "logs">("overview");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {(["overview", "courses", "users", "logs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm border capitalize transition-colors ${
              tab === t ? "bg-accent text-white border-accent" : "border-surface-line text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <p className="text-xs text-muted">Users</p>
            <p className="font-display text-3xl font-semibold mt-1">{stats.users}</p>
          </Card>
          <Card>
            <p className="text-xs text-muted">Courses</p>
            <p className="font-display text-3xl font-semibold mt-1">{stats.courses}</p>
          </Card>
          <Card>
            <p className="text-xs text-muted">Lessons</p>
            <p className="font-display text-3xl font-semibold mt-1">{stats.lessons}</p>
          </Card>
        </div>
      )}

      {tab === "courses" && (
        <div className="space-y-6">
          <Card>
            <p className="text-sm font-medium mb-4">New course</p>
            <form
              action={(fd) =>
                startTransition(() => {
                  createCourse(fd);
                })
              }
              className="grid sm:grid-cols-2 gap-4"
            >
              <Field label="Title" htmlFor="title">
                <Input id="title" name="title" required />
              </Field>
              <Field label="Language code" htmlFor="language_code" hint="e.g. es, fr, de, ja">
                <select
                  id="language_code"
                  name="language_code"
                  className="w-full rounded-xl border border-surface-line bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag_emoji} {l.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Mode" htmlFor="mode">
                <select
                  id="mode"
                  name="mode"
                  className="w-full rounded-xl border border-surface-line bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                >
                  {MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Level" htmlFor="level">
                <select
                  id="level"
                  name="level"
                  className="w-full rounded-xl border border-surface-line bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                >
                  {["beginner", "elementary", "intermediate", "upper_intermediate", "advanced", "fluent"].map(
                    (l) => (
                      <option key={l} value={l}>
                        {l.replace("_", " ")}
                      </option>
                    )
                  )}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description" htmlFor="description">
                  <Textarea id="description" name="description" rows={2} />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_published" /> Publish immediately
              </label>
              <Button type="submit" disabled={pending} className="sm:col-span-2 w-fit">
                {pending ? "Creating…" : "Create course"}
              </Button>
            </form>
          </Card>

          <Card className="p-0 divide-y divide-surface-line">
            {courses.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium">
                    {c.languages?.flag_emoji} {c.title}
                  </p>
                  <p className="text-xs text-muted capitalize">{c.mode.replace("_", " ")} · {c.level}</p>
                </div>
                <button
                  onClick={() => startTransition(() => togglePublishCourse(c.id, c.is_published))}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${
                    c.is_published ? "border-teal text-teal" : "border-surface-line text-muted"
                  }`}
                >
                  {c.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                  {c.is_published ? "Published" : "Draft"}
                </button>
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === "users" && (
        <Card className="p-0 divide-y divide-surface-line">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-medium">{u.display_name}</p>
                <p className="text-xs text-muted">XP {u.xp} · Streak {u.current_streak}</p>
              </div>
              <select
                defaultValue={u.role}
                onChange={(e) => startTransition(() => updateUserRole(u.id, e.target.value))}
                className="text-xs rounded-lg border border-surface-line bg-background/40 px-2 py-1.5 outline-none"
              >
                {["student", "teacher", "admin", "enterprise", "parent"].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </Card>
      )}

      {tab === "logs" && (
        <Card className="p-0 divide-y divide-surface-line">
          {logs.length === 0 && <p className="p-5 text-sm text-muted">No admin actions logged yet.</p>}
          {logs.map((l) => (
            <div key={l.id} className="px-5 py-3 text-sm">
              <span className="font-mono text-xs text-accent">{l.action}</span>{" "}
              <span className="text-muted text-xs">
                {l.target_table} · {new Date(l.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
