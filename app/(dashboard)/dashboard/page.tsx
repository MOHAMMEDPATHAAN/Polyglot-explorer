import Link from "next/link";
import { getDashboardData } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Stamp } from "@/components/ui/Stamp";
import { ButtonLink } from "@/components/ui/Button";
import { MODES, formatMode } from "@/lib/utils";
import { Flame, Zap, Target, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const data = await getDashboardData();
  if (!data) return null;
  const { profile, recentProgress, goal, courses } = data;

  const xpTarget = goal?.xp_target ?? 30;
  const xpEarned = goal?.xp_earned ?? 0;
  const goalPct = Math.min(100, Math.round((xpEarned / Math.max(1, xpTarget)) * 100));

  const continueLesson = recentProgress.find((p: any) => p.status === "in_progress") ?? recentProgress[0];
  const favoriteMode = MODES.find((m) => m.value === profile?.preferred_mode);
  const recommended = courses.filter((c: any) => c.mode === profile?.preferred_mode).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome panel */}
      <div className="rounded-2xl border border-surface-line bg-[radial-gradient(circle_at_top_left,rgba(225,87,60,0.12),transparent_60%)] p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <p className="text-sm text-muted">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="font-display text-3xl font-semibold mt-1">
            Welcome back, {profile?.display_name?.split(" ")[0] ?? "explorer"}.
          </h1>
          <p className="text-muted mt-1 text-sm">
            You&apos;re in <span className="text-accent font-medium">{favoriteMode?.label ?? "Educational"}</span> mode.
            Let&apos;s keep the streak alive.
          </p>
        </div>
        <ButtonLink href={continueLesson ? `/lesson/${continueLesson.lesson_id}` : "/learn"} size="lg">
          Continue learning <ArrowRight size={16} />
        </ButtonLink>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <Stamp size={52} color="var(--accent)">
            {profile?.current_streak ?? 0}
          </Stamp>
          <div>
            <p className="text-xs text-muted flex items-center gap-1">
              <Flame size={12} /> Day streak
            </p>
            <p className="text-lg font-display font-semibold">{profile?.current_streak ?? 0} days</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-full bg-gold/15 text-gold flex items-center justify-center font-mono font-semibold text-sm" style={{ width: 52, height: 52 }}>
            {profile?.xp ?? 0}
          </div>
          <div>
            <p className="text-xs text-muted flex items-center gap-1">
              <Zap size={12} /> Total XP
            </p>
            <p className="text-lg font-display font-semibold">{profile?.xp ?? 0} XP</p>
          </div>
        </Card>
        <Card className="col-span-2 lg:col-span-1">
          <p className="text-xs text-muted flex items-center gap-1 mb-2">
            <Target size={12} /> Daily goal
          </p>
          <div className="h-2 rounded-full bg-background overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${goalPct}%` }} />
          </div>
          <p className="text-xs text-muted mt-1.5">
            {xpEarned} / {xpTarget} XP today
          </p>
        </Card>
        <Card className="col-span-2 lg:col-span-1">
          <p className="text-xs text-muted mb-1">Skill level</p>
          <p className="font-display text-lg font-semibold capitalize">
            {profile?.current_skill_level?.replace("_", " ") ?? "Beginner"}
          </p>
          <p className="text-xs text-muted mt-0.5">Target: {profile?.target_languages?.join(", ") || "Not set"}</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recommended next */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recommended next steps</h2>
            <Link href="/learn" className="text-sm text-accent hover:underline">
              See all
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {(recommended.length ? recommended : courses.slice(0, 4)).map((course: any) => (
              <Link key={course.id} href={`/learn/course/${course.id}`}>
                <Card className="hover:border-accent/50 transition-colors h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{course.languages?.flag_emoji}</span>
                    <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-accent/10 text-accent">
                      {formatMode(course.mode)}
                    </span>
                  </div>
                  <p className="font-medium">{course.title}</p>
                  <p className="text-xs text-muted mt-1 line-clamp-2">{course.description}</p>
                </Card>
              </Link>
            ))}
          </div>

          <h2 className="font-display text-xl font-semibold pt-2">Recent activity</h2>
          <Card className="divide-y divide-surface-line p-0">
            {recentProgress.length === 0 && (
              <p className="p-5 text-sm text-muted">No lessons yet — start your first one from Learn.</p>
            )}
            {recentProgress.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium">{p.lessons?.title}</p>
                  <p className="text-xs text-muted">
                    {p.lessons?.units?.courses?.title} · {p.lessons?.units?.title}
                  </p>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-full ${
                    p.status === "completed" ? "bg-teal/15 text-teal" : "bg-gold/15 text-gold"
                  }`}
                >
                  {p.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </Card>
        </div>

        {/* Mode switcher / favorite languages */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Learning modes</h2>
          <Card className="p-2">
            {MODES.map((m) => (
              <Link
                key={m.value}
                href={`/learn?mode=${m.value}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-background/40 transition-colors"
              >
                <span className="text-xl">{m.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="text-xs text-muted truncate">{m.blurb}</p>
                </div>
              </Link>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
