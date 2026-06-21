import { getProfile } from "@/lib/data";
import { WritingPractice } from "@/components/learn/WritingPractice";

export default async function WritingPage() {
  const profile = await getProfile();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Writing</h1>
        <p className="text-muted text-sm mt-1">Pick a prompt, write, and get instant AI feedback.</p>
      </div>
      <WritingPractice mode={profile?.preferred_mode} />
    </div>
  );
}
