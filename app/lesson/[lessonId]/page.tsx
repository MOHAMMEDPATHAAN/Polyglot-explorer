import { notFound, redirect } from "next/navigation";
import { getLessonWithExercises, getCurrentUser } from "@/lib/data";
import { LessonPlayer } from "@/components/learn/LessonPlayer";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { lessonId } = await params;
  const { lesson, exercises } = await getLessonWithExercises(lessonId);
  if (!lesson) notFound();

  const courseId = (lesson as any).units?.course_id;

  return <LessonPlayer lesson={lesson as any} exercises={exercises as any} courseId={courseId} />;
}
