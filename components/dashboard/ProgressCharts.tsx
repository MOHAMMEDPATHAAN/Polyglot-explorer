"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Stamp } from "@/components/ui/Stamp";

export function ProgressCharts({
  progress,
  quizAttempts,
  achievements,
  profile,
}: {
  progress: { status: string; score: number | null; completed_at: string | null }[];
  quizAttempts: { is_correct: boolean | null; attempted_at: string }[];
  achievements: { earned_at: string; achievements: any }[];
  profile: { xp: number; current_streak: number; longest_streak: number } | null;
}) {
  const completed = progress.filter((p) => p.status === "completed");
  const correct = quizAttempts.filter((a) => a.is_correct).length;
  const accuracy = quizAttempts.length ? Math.round((correct / quizAttempts.length) * 100) : 0;

  // Last 7 days of lesson completions
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const weekly = days.map((d) => {
    const key = d.toISOString().slice(0, 10);
    const count = completed.filter((p) => p.completed_at?.slice(0, 10) === key).length;
    return { day: d.toLocaleDateString(undefined, { weekday: "short" }), lessons: count };
  });

  const accuracyData = [
    { name: "Correct", value: correct },
    { name: "Incorrect", value: quizAttempts.length - correct },
  ];
  const COLORS = ["var(--color-teal, #3fa9a0)", "var(--surface-line, #25393d)"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <Stamp size={48} color="var(--accent)">{profile?.current_streak ?? 0}</Stamp>
          <div>
            <p className="text-xs text-muted">Current streak</p>
            <p className="text-sm font-medium">{profile?.longest_streak ?? 0} best</p>
          </div>
        </Card>
        <Card>
          <p className="text-xs text-muted">Total XP</p>
          <p className="font-display text-2xl font-semibold mt-1">{profile?.xp ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Lessons completed</p>
          <p className="font-display text-2xl font-semibold mt-1">{completed.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Quiz accuracy</p>
          <p className="font-display text-2xl font-semibold mt-1">{accuracy}%</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <p className="text-sm font-medium mb-4">Lessons completed — last 7 days</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-line)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--surface-line)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="lessons" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="text-sm font-medium mb-4">Quiz accuracy breakdown</p>
          {quizAttempts.length === 0 ? (
            <p className="text-sm text-muted py-16 text-center">No quiz attempts yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={accuracyData} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2}>
                  {accuracyData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--surface-line)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold mb-4">Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {achievements.length === 0 && (
            <p className="text-sm text-muted col-span-full">
              No achievements yet — complete a lesson to earn your first stamp.
            </p>
          )}
          {achievements.map((a, i) => (
            <Card key={i} className="flex flex-col items-center text-center gap-2 py-5">
              <div className="stamp w-14 h-14 text-gold text-2xl">{a.achievements?.icon}</div>
              <p className="text-xs font-medium">{a.achievements?.title}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
