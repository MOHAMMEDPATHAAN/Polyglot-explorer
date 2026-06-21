import { ReadingPractice } from "@/components/learn/ReadingPractice";

export default function ReadingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Reading</h1>
        <p className="text-muted text-sm mt-1">
          Short passages with click-to-translate words and comprehension checks.
        </p>
      </div>
      <ReadingPractice />
    </div>
  );
}
