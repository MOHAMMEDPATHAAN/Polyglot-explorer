import Link from "next/link";
import { requestPasswordReset } from "../actions";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Reset your password</h1>
        <p className="text-muted text-sm mt-1">
          We&apos;ll email you a secure link to choose a new one.
        </p>
      </div>

      {params.notice && (
        <p className="text-sm rounded-lg bg-teal/10 border border-teal/30 text-teal px-3 py-2">
          {params.notice}
        </p>
      )}
      {params.error && (
        <p className="text-sm rounded-lg bg-accent/10 border border-accent/30 text-accent px-3 py-2">
          {params.error}
        </p>
      )}

      <form action={requestPasswordReset} className="space-y-4">
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </Field>
        <Button type="submit" className="w-full" size="lg">
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        <Link href="/login" className="text-accent hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
