"use client";

import { useState, useRef, useTransition } from "react";
import { Camera, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/actions/profile";
import { MODES } from "@/lib/utils";
import type { Profile } from "@/lib/types/database";

const LANGUAGES = ["en", "es", "fr", "de", "ja", "it", "pt", "ko", "hi", "zh"];
const LEVELS = ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced", "fluent"];

export function ProfileForm({ profile }: { profile: Profile }) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${profile.id}/avatar-${Date.now()}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(formData: FormData) {
    formData.set("avatar_url", avatarUrl);
    startTransition(async () => {
      await updateProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative w-20 h-20 rounded-full bg-accent/15 text-accent flex items-center justify-center text-2xl font-display font-semibold overflow-hidden group"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            (profile.display_name ?? "?").charAt(0).toUpperCase()
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={18} className="text-white" />
          </div>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        <div>
          <p className="text-sm font-medium">{uploading ? "Uploading…" : "Profile photo"}</p>
          <p className="text-xs text-muted">PNG or JPG, up to 5MB.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Display name" htmlFor="display_name">
          <Input id="display_name" name="display_name" defaultValue={profile.display_name ?? ""} required />
        </Field>
        <Field label="Username" htmlFor="username">
          <Input id="username" name="username" defaultValue={profile.username ?? ""} />
        </Field>
      </div>

      <Field label="Bio" htmlFor="bio">
        <Textarea id="bio" name="bio" rows={3} defaultValue={profile.bio ?? ""} placeholder="A little about you…" />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Native language" htmlFor="native_language">
          <select
            id="native_language"
            name="native_language"
            defaultValue={profile.native_language}
            className="w-full rounded-xl border border-surface-line bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-accent"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Target languages" htmlFor="target_languages" hint="Comma-separated, e.g. es, fr">
          <Input
            id="target_languages"
            name="target_languages"
            defaultValue={profile.target_languages?.join(", ") ?? ""}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Skill level" htmlFor="current_skill_level">
          <select
            id="current_skill_level"
            name="current_skill_level"
            defaultValue={profile.current_skill_level}
            className="w-full rounded-xl border border-surface-line bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-accent capitalize"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l.replace("_", " ")}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preferred mode" htmlFor="preferred_mode">
          <select
            id="preferred_mode"
            name="preferred_mode"
            defaultValue={profile.preferred_mode}
            className="w-full rounded-xl border border-surface-line bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-accent"
          >
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Learning goals" htmlFor="learning_goals">
        <Textarea
          id="learning_goals"
          name="learning_goals"
          rows={2}
          defaultValue={profile.learning_goals ?? ""}
          placeholder="e.g. Conversational Spanish before my trip in June"
        />
      </Field>

      <Field label="Timezone" htmlFor="timezone">
        <Input id="timezone" name="timezone" defaultValue={profile.timezone} />
      </Field>

      <Button type="submit" disabled={pending}>
        {saved ? (
          <>
            <Check size={16} /> Saved
          </>
        ) : pending ? (
          "Saving…"
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );
}
