"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Dumbbell,
  Library,
  Sparkles,
  Mic,
  PenLine,
  BookText,
  TrendingUp,
  UserCircle,
  Settings,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Home,
  BookOpen,
  Dumbbell,
  Library,
  Sparkles,
  Mic,
  PenLine,
  BookText,
  TrendingUp,
  UserCircle,
  Settings,
};

const LINKS = [
  { href: "/dashboard", label: "Home", icon: "Home" },
  { href: "/learn", label: "Learn", icon: "BookOpen" },
  { href: "/practice", label: "Practice", icon: "Dumbbell" },
  { href: "/dictionary", label: "Dictionary", icon: "Library" },
  { href: "/ai-tutor", label: "AI Tutor", icon: "Sparkles" },
  { href: "/speaking", label: "Speaking", icon: "Mic" },
  { href: "/writing", label: "Writing", icon: "PenLine" },
  { href: "/reading", label: "Reading", icon: "BookText" },
  { href: "/progress", label: "Progress", icon: "TrendingUp" },
];

export function Sidebar({ isStaff }: { isStaff: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-surface-line bg-ink min-h-screen sticky top-0 px-4 py-6">
      <Link href="/dashboard" className="flex items-center gap-2 px-2 mb-8">
        <Compass className="text-accent" size={22} />
        <span className="font-display text-lg font-semibold tracking-tight text-ink-text">
          Polyglot <span className="text-accent">Explorer</span>
        </span>
      </Link>

      <nav className="flex-1 flex flex-col gap-1">
        {LINKS.map((link) => {
          const Icon = ICONS[link.icon];
          const active = pathname === link.href || pathname?.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                active
                  ? "bg-accent/15 text-accent font-medium"
                  : "text-ink-text/70 hover:bg-white/5 hover:text-ink-text"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}

        <div className="h-px bg-surface-line my-3" />

        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
            pathname === "/profile"
              ? "bg-accent/15 text-accent font-medium"
              : "text-ink-text/70 hover:bg-white/5 hover:text-ink-text"
          )}
        >
          <UserCircle size={18} />
          Profile
        </Link>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
            pathname === "/settings"
              ? "bg-accent/15 text-accent font-medium"
              : "text-ink-text/70 hover:bg-white/5 hover:text-ink-text"
          )}
        >
          <Settings size={18} />
          Settings
        </Link>
        {isStaff && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
              pathname?.startsWith("/admin")
                ? "bg-accent/15 text-accent font-medium"
                : "text-ink-text/70 hover:bg-white/5 hover:text-ink-text"
            )}
          >
            <ShieldCheck size={18} />
            Admin
          </Link>
        )}
      </nav>

      <div className="px-3 py-3 rounded-xl bg-white/5 text-xs text-ink-text/60">
        Built with Supabase + Next.js, ready for Capacitor mobile builds.
      </div>
    </aside>
  );
}
