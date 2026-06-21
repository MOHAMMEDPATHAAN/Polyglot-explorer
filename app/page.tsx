import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MODES } from "@/lib/utils";
import { Compass, Flame, Mic, Sparkles, PenLine, BarChart3, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Tutor, always on",
    desc: "Ask grammar questions, get instant corrections, and practice conversations with an AI tutor tuned to your mode.",
  },
  {
    icon: Mic,
    title: "Speaking practice",
    desc: "Record yourself, see a live transcript, and get a match score against the target phrase.",
  },
  {
    icon: PenLine,
    title: "Writing feedback",
    desc: "Write emails, stories, and intros — get specific, encouraging AI feedback in seconds.",
  },
  {
    icon: BarChart3,
    title: "Real progress tracking",
    desc: "Streaks, XP, accuracy charts, and achievement stamps that actually reflect your learning.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink text-ink-text">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 lg:px-10 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Compass className="text-accent" size={22} />
          <span className="font-display text-lg font-semibold tracking-tight">
            Polyglot <span className="text-accent">Explorer</span>
          </span>
        </div>
        <nav className="flex items-center gap-3">
          <ButtonLink href="/login" variant="ghost" size="sm" className="text-ink-text hover:bg-white/10">
            Sign in
          </ButtonLink>
          <ButtonLink href="/signup" size="sm">
            Get started
          </ButtonLink>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 lg:px-10 max-w-5xl mx-auto text-center pt-16 pb-20">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-ink-text/70 mb-6">
          <span className="stamp w-5 h-5 text-accent text-[8px]">7</span>
          modes, one passport to fluency
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] tracking-tight">
          Learn a language like you&apos;re actually going to <span className="text-accent">use it.</span>
        </h1>
        <p className="text-ink-text/70 text-lg mt-6 max-w-2xl mx-auto">
          Polyglot Explorer adapts to why you&apos;re learning — school, work, travel, exams, or just for fun —
          with AI tutoring, speaking practice, and progress that feels earned.
        </p>
        <div className="flex items-center justify-center gap-4 mt-9">
          <ButtonLink href="/signup" size="lg">
            Start learning free <ArrowRight size={18} />
          </ButtonLink>
          <ButtonLink href="/login" variant="secondary" size="lg" className="bg-white/5 border-white/15 text-ink-text">
            I have an account
          </ButtonLink>
        </div>
      </section>

      {/* Mode grid */}
      <section className="px-6 lg:px-10 max-w-6xl mx-auto pb-20">
        <p className="text-center text-sm text-ink-text/50 uppercase tracking-widest mb-6">Pick your mode</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MODES.map((m) => (
            <div
              key={m.value}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center hover:border-accent/40 transition-colors"
            >
              <span className="text-2xl">{m.icon}</span>
              <p className="text-sm font-medium mt-2">{m.label}</p>
              <p className="text-xs text-ink-text/50 mt-1">{m.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-10 max-w-6xl mx-auto pb-24">
        <div className="grid sm:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                <f.icon size={20} />
              </div>
              <div>
                <p className="font-display font-semibold text-lg">{f.title}</p>
                <p className="text-sm text-ink-text/60 mt-1.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Streak callout */}
      <section className="px-6 lg:px-10 max-w-4xl mx-auto pb-24">
        <Card className="bg-white/5 border-white/10 text-ink-text flex flex-col sm:flex-row items-center gap-6 p-8">
          <div className="stamp w-16 h-16 text-accent text-xl shrink-0">
            <Flame size={26} />
          </div>
          <div className="text-center sm:text-left">
            <p className="font-display text-xl font-semibold">Streaks, XP, and stamps that mean something</p>
            <p className="text-sm text-ink-text/60 mt-1">
              Every completed lesson earns real progress — tracked with charts, not just badges.
            </p>
          </div>
          <ButtonLink href="/signup" className="sm:ml-auto shrink-0">
            Join free
          </ButtonLink>
        </Card>
      </section>

      <footer className="border-t border-white/10 px-6 lg:px-10 py-8 text-center text-xs text-ink-text/40">
        Polyglot Explorer · Built with Next.js & Supabase
      </footer>
    </div>
  );
}
