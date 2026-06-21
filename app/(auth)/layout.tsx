import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[radial-gradient(circle_at_20%_20%,rgba(225,87,60,0.18),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(63,169,160,0.18),transparent_50%)] border-r border-surface-line">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
          Polyglot <span className="text-accent">Explorer</span>
        </Link>
        <div className="space-y-6 max-w-md">
          <p className="font-display text-4xl leading-tight">
            “Every language is a different way of looking at life.”
          </p>
          <p className="text-muted text-sm">
            Federico Fellini — and the reason we built a tutor that adapts to how you actually learn.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <div className="stamp w-10 h-10 text-accent text-xs">7</div>
          <span>languages and counting, with Kids, Business, Travel & Exam Prep modes built in.</span>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
