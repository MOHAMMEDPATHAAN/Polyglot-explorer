import { getProfile } from "@/lib/data";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
  const profile = await getProfile();
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
        <p className="text-muted text-sm mt-1">Theme, privacy, data export, and account controls.</p>
      </div>
      <SettingsForm profile={profile} />
    </div>
  );
}
