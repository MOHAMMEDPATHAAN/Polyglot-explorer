import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const MODES: { value: string; label: string; icon: string; blurb: string }[] = [
  { value: "kids", label: "Kids Mode", icon: "🦊", blurb: "Bright, playful lessons for young learners" },
  { value: "educational", label: "Educational", icon: "🎓", blurb: "Structured lessons for school & college" },
  { value: "pg_adult", label: "PG / Adult", icon: "🧭", blurb: "Formal, advanced vocabulary" },
  { value: "business", label: "Business", icon: "💼", blurb: "Meetings, emails, interviews" },
  { value: "travel", label: "Travel", icon: "🧳", blurb: "Airports, hotels, daily conversation" },
  { value: "exam_prep", label: "Exam Prep", icon: "📝", blurb: "Test-focused structured practice" },
  { value: "immersion", label: "Immersion", icon: "🌍", blurb: "Stories, audio, real-world drills" },
];

export const SIDEBAR_LINKS = [
  { href: "/dashboard", label: "Home", icon: "Home" },
  { href: "/learn", label: "Learn", icon: "BookOpen" },
  { href: "/practice", label: "Practice", icon: "Dumbbell" },
  { href: "/dictionary", label: "Dictionary", icon: "Library" },
  { href: "/ai-tutor", label: "AI Tutor", icon: "Sparkles" },
  { href: "/speaking", label: "Speaking", icon: "Mic" },
  { href: "/writing", label: "Writing", icon: "PenLine" },
  { href: "/reading", label: "Reading", icon: "BookText" },
  { href: "/progress", label: "Progress", icon: "TrendingUp" },
  { href: "/profile", label: "Profile", icon: "UserCircle" },
  { href: "/settings", label: "Settings", icon: "Settings" },
];

export function formatMode(mode: string) {
  return MODES.find((m) => m.value === mode)?.label ?? mode;
}
