import { createClient } from "@/lib/supabase/server";
import { SpeakingPractice } from "@/components/learn/SpeakingPractice";

export default async function SpeakingPage() {
  const supabase = await createClient();
  const { data: words } = await supabase
    .from("vocabulary_words")
    .select("*, languages(code, name, flag_emoji)")
    .limit(20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Speaking</h1>
        <p className="text-muted text-sm mt-1">
          Repeat the phrase, record yourself, and see how close your pronunciation transcript matches.
        </p>
      </div>
      <SpeakingPractice words={(words ?? []) as any} />
    </div>
  );
}
