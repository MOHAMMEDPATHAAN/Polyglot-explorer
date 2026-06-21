import { getProfile, getChatSessions, getChatMessages } from "@/lib/data";
import { TutorChat } from "@/components/learn/TutorChat";

export default async function AiTutorPage() {
  const profile = await getProfile();
  const sessions = await getChatSessions();
  const latest = sessions[0];
  const messages = latest ? await getChatMessages(latest.id) : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl font-semibold">AI Tutor</h1>
        <p className="text-muted text-sm mt-1">
          Personalized help, tuned to your {profile?.preferred_mode?.replace("_", " ")} mode.
        </p>
      </div>
      <TutorChat
        initialMessages={messages as any}
        initialSessionId={latest?.id ?? null}
        modeContext={profile?.preferred_mode}
        languageContext={profile?.target_languages?.[0]}
      />
    </div>
  );
}
