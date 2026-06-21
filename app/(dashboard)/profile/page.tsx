import { getProfile } from "@/lib/data";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Profile</h1>
        <p className="text-muted text-sm mt-1">How you show up across Polyglot Explorer.</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
