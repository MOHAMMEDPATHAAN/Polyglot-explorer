import Link from "next/link";
import { signUp } from "../actions";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Start exploring</h1>
        <p className="text-muted text-sm mt-1">
          Create your account — kids, students, and professionals all welcome.
        </p>
      </div>

      {params.error && (
        <p className="text-sm rounded-lg bg-accent/10 border border-accent/30 text-accent px-3 py-2">
          {params.error}
        </p>
      )}

      <form action={signUp} className="space-y-4">
        <Field label="Display name" htmlFor="displayName">
          <Input id="displayName" name="displayName" placeholder="Alex Rivera" required />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </Field>
        <Field label="Password" htmlFor="password" hint="At least 8 characters.">
          <Input id="password" name="password" type="password" minLength={8} required />
        </Field>
        <Field label="This account is for" htmlFor="ageGroup">
          <select
            id="ageGroup"
            name="ageGroup"
            className="w-full rounded-xl border border-surface-line bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-accent"
          >
            <option value="adult">Myself (adult)</option>
            <option value="teen">Myself (teen)</option>
            <option value="child">My child (sets up Kids Mode + parent controls)</option>
          </select>
        </Field>
        <Button type="submit" className="w-full" size="lg">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
