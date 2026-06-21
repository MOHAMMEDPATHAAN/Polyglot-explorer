import Link from "next/link";
import { signIn, signInWithProvider } from "../actions";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; redirectTo?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
        <p className="text-muted text-sm mt-1">Sign in to continue your streak.</p>
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

      <form action={signIn} className="space-y-4">
        <input type="hidden" name="redirectTo" value={params.redirectTo ?? "/dashboard"} />
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input id="password" name="password" type="password" placeholder="••••••••" required />
        </Field>
        <div className="flex justify-end -mt-2">
          <Link href="/forgot-password" className="text-xs text-accent hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg">
          Sign in
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted">
        <div className="h-px flex-1 bg-surface-line" />
        or continue with
        <div className="h-px flex-1 bg-surface-line" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(["google", "apple", "github"] as const).map((provider) => (
          <form key={provider} action={signInWithProvider.bind(null, provider)}>
            <Button type="submit" variant="secondary" className="w-full capitalize" size="sm">
              {provider}
            </Button>
          </form>
        ))}
      </div>

      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
