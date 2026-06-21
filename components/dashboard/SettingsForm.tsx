"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { updateSettings, deleteAccount } from "@/lib/actions/profile";
import type { Profile } from "@/lib/types/database";
import { Download, Trash2, AlertTriangle } from "lucide-react";

export function SettingsForm({ profile }: { profile: Profile }) {
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(() => {
      updateSettings(formData);
    });
  }

  async function handleDelete() {
    await deleteAccount();
    router.push("/login");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <h2 className="font-display text-lg font-semibold mb-4">Preferences</h2>
        <form action={handleSubmit} className="space-y-4">
          <Field label="Theme" htmlFor="theme_preference">
            <select
              id="theme_preference"
              name="theme_preference"
              defaultValue={profile.theme_preference}
              className="w-full rounded-xl border border-surface-line bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-accent"
            >
              <option value="system">Match system</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </Field>
          {profile.age_group === "child" && (
            <Field
              label="Daily screen time limit (minutes)"
              htmlFor="daily_time_limit_minutes"
              hint="Parent control — leave blank for no limit."
            >
              <Input
                id="daily_time_limit_minutes"
                name="daily_time_limit_minutes"
                type="number"
                min={5}
                defaultValue={profile.daily_time_limit_minutes ?? ""}
              />
            </Field>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save preferences"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-display text-lg font-semibold mb-1">Your data</h2>
        <p className="text-sm text-muted mb-4">Export everything we store about your learning activity.</p>
        <a href="/api/export-data" download>
          <Button variant="secondary">
            <Download size={16} /> Export my data (JSON)
          </Button>
        </a>
      </Card>

      <Card className="border-accent/30">
        <h2 className="font-display text-lg font-semibold mb-1 flex items-center gap-2 text-accent">
          <AlertTriangle size={18} /> Danger zone
        </h2>
        <p className="text-sm text-muted mb-4">
          Deactivates your account and signs you out. This can be reversed by contacting support.
        </p>
        {!confirmDelete ? (
          <Button variant="outline" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={16} /> Delete account
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleDelete}>
              Yes, deactivate my account
            </Button>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
