import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProgressAnalytics } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Mic, PenLine, BookText, Library, Shuffle } from "lucide-react";

export default async function PracticePage() {
  const user = await getCurrentUser();
  const supabase = await createClient();
  const analytics = user ? await getProgressAnalytics() : null;

  const { data: randomLessons } = await supabase
    .from("lessons")
    .select("id, title, xp_reward, units(title, courses(title, mode))")
    .eq("is_published", true)
    .limit(6);

  const accuracy = analytics?.quizAttempts.length
    ? Math.round(
        (analytics.quizAttempts.filter((a: any) => a.is_correct).length / analytics.quizAttempts.length) * 100
      )
    : null;

  const tiles = [
    { href: "/dictionary?tab=mine", label: "Flashcard review", icon: Library, desc: "Spaced-repetition vocabulary drill" },
    { href: "/speaking", label: "Speaking practice", icon: Mic, desc: "Pronunciation & repeat-after-me" },
    { href: "/writing", label: "Writing practice", icon: PenLine, desc: "Sentence building & AI feedback" },
    { href: "/reading", label: "Reading practice", icon: BookText, desc: "Short stories with comprehension" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Practice</h1>
        <p className="text-muted text-sm mt-1">Sharpen specific skills, on your own schedule.</p>
      </div>

      {accuracy !== null && (
        <Card className="flex items-center gap-4">
          <div className="stamp w-14 h-14 text-teal text-sm font-mono">{accuracy}%</div>
          <div>
            <p className="text-sm font-medium">Overall quiz accuracy</p>
            <p className="text-xs text-muted">Across {analytics!.quizAttempts.length} attempted exercises</p>
          </div>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href}>
            <Card className="flex items-center gap-4 hover:border-accent/50 transition-colors h-full">
              <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <t.icon size={20} />
              </div>
              <div>
                <p className="font-medium text-sm">{t.label}</p>
                <p className="text-xs text-muted mt-0.5">{t.desc}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Quick lesson shuffle</h2>
        <Shuffle size={16} className="text-muted" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(randomLessons ?? []).map((lesson: any) => (
          <Card key={lesson.id} className="flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-wide text-accent">{lesson.units?.courses?.mode}</p>
            <p className="font-medium text-sm">{lesson.title}</p>
            <p className="text-xs text-muted">{lesson.units?.title}</p>
            <ButtonLink href={`/lesson/${lesson.id}`} size="sm" variant="secondary" className="mt-auto w-fit">
              Practice now
            </ButtonLink>
          </Card>
        ))}
      </div>
    </div>
  );
}
