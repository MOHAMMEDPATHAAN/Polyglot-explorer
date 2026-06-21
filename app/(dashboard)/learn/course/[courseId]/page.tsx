import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseWithUnits } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const { course, units, progress } = await getCourseWithUnits(courseId);
  if (!course) notFound();

  const progressMap = new Map(progress.map((p: any) => [p.lesson_id, p]));

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <span className="text-4xl">{(course as any).languages?.flag_emoji}</span>
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-semibold">{course.title}</h1>
          <p className="text-muted text-sm mt-1">{course.description}</p>
        </div>
      </div>

      <div className="space-y-6">
        {units.map((unit: any, unitIdx: number) => (
          <div key={unit.id}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{unit.icon}</span>
              <h2 className="font-display text-lg font-semibold">{unit.title}</h2>
            </div>
            <Card className="p-0 divide-y divide-surface-line">
              {(unit.lessons ?? [])
                .sort((a: any, b: any) => a.order_index - b.order_index)
                .map((lesson: any, lessonIdx: number) => {
                  const lp = progressMap.get(lesson.id) as any;
                  const completed = lp?.status === "completed";
                  const isFirst = unitIdx === 0 && lessonIdx === 0;
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lesson/${lesson.id}`}
                      className="flex items-center gap-3 px-5 py-4 hover:bg-background/40 transition-colors"
                    >
                      {completed ? (
                        <CheckCircle2 size={20} className="text-teal shrink-0" />
                      ) : lp || isFirst ? (
                        <PlayCircle size={20} className="text-accent shrink-0" />
                      ) : (
                        <Circle size={20} className="text-muted shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{lesson.title}</p>
                        <p className="text-xs text-muted truncate">{lesson.description}</p>
                      </div>
                      <span className="text-xs font-mono text-gold shrink-0">+{lesson.xp_reward} XP</span>
                    </Link>
                  );
                })}
            </Card>
          </div>
        ))}
        {units.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-muted text-sm">This course doesn&apos;t have any units yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
