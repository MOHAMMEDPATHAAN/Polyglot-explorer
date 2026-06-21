"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Library, Sparkles, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Home", Icon: Home },
  { href: "/learn", label: "Learn", Icon: BookOpen },
  { href: "/dictionary", label: "Words", Icon: Library },
  { href: "/ai-tutor", label: "Tutor", Icon: Sparkles },
  { href: "/profile", label: "Profile", Icon: UserCircle },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-surface-line bg-background/95 backdrop-blur-xl flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {LINKS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname?.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 text-[11px]",
              active ? "text-accent" : "text-muted"
            )}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
