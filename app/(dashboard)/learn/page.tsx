import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { MODES } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const activeMode = mode ?? "educational";
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("*, languages(name, flag_emoji, code), units(id)")
    .eq("mode", activeMode)
    .eq("is_published", true)
    .order("order_index");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Learn</h1>
        <p className="text-muted text-sm mt-1">Pick a mode, then a language, then dive in.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {MODES.map((m) => (
          <Link
            key={m.value}
            href={`/learn?mode=${m.value}`}
            className={cn(
              "shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors",
              activeMode === m.value
                ? "bg-accent text-white border-accent"
                : "border-surface-line text-muted hover:border-accent/50"
            )}
          >
            <span>{m.icon}</span> {m.label}
          </Link>
        ))}
      </div>

      <p className="text-sm text-muted">
        {MODES.find((m) => m.value === activeMode)?.blurb}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(courses ?? []).map((course: any) => (
          <Link key={course.id} href={`/learn/course/${course.id}`}>
            <Card className="hover:border-accent/50 transition-colors h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{course.languages?.flag_emoji}</span>
                <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-surface-line text-muted">
                  {course.level.replace("_", " ")}
                </span>
              </div>
              <p className="font-display font-semibold text-lg">{course.title}</p>
              <p className="text-sm text-muted mt-1.5 flex-1">{course.description}</p>
              <p className="text-xs text-accent mt-4">{course.units?.length ?? 0} units →</p>
            </Card>
          </Link>
        ))}
        {(!courses || courses.length === 0) && (
          <Card className="sm:col-span-2 lg:col-span-3 text-center py-12">
            <p className="text-muted text-sm">
              No published courses in this mode yet. Check back soon, or browse another mode above.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
