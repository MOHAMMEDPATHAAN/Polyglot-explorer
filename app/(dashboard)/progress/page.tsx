import { getProgressAnalytics } from "@/lib/data";
import { ProgressCharts } from "@/components/dashboard/ProgressCharts";

export default async function ProgressPage() {
  const analytics = await getProgressAnalytics();
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Progress</h1>
        <p className="text-muted text-sm mt-1">Your fluency journey, tracked.</p>
      </div>
      <ProgressCharts
        progress={analytics.progress as any}
        quizAttempts={analytics.quizAttempts as any}
        achievements={analytics.achievements as any}
        profile={analytics.profile as any}
      />
    </div>
  );
}
