"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, Sun, Moon, LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Notification } from "@/lib/types/database";

export function Topbar({
  profile,
  notifications,
}: {
  profile: Profile | null;
  notifications: Notification[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [query, setQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("pe-theme")) as
      | "dark"
      | "light"
      | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("pe-theme", next);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/dictionary?q=${encodeURIComponent(query.trim())}`);
  }

  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-6 py-3 border-b border-surface-line bg-background/80 backdrop-blur-xl">
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="flex items-center gap-2 rounded-full border border-surface-line bg-surface px-4 py-2">
          <Search size={16} className="text-muted shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words, lessons, phrases…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
      </form>

      <div className="flex-1" />

      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-surface text-muted hover:text-foreground transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setNotifOpen((v) => !v)}
          className="relative p-2 rounded-full hover:bg-surface text-muted hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
          )}
        </button>
        {notifOpen && (
          <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-surface-line bg-surface shadow-xl p-2 max-h-96 overflow-y-auto scrollbar-thin">
            <p className="px-2 py-1.5 text-xs font-medium text-muted uppercase tracking-wide">
              Notifications
            </p>
            {notifications.length === 0 && (
              <p className="px-2 py-6 text-sm text-muted text-center">You&apos;re all caught up.</p>
            )}
            {notifications.map((n) => (
              <div key={n.id} className="px-2 py-2 rounded-xl hover:bg-background/40 text-sm">
                <p className="font-medium">{n.title}</p>
                {n.body && <p className="text-muted text-xs mt-0.5">{n.body}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-surface transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-semibold font-display overflow-hidden">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              (profile?.display_name ?? "?").charAt(0).toUpperCase()
            )}
          </div>
          <ChevronDown size={14} className="text-muted hidden sm:block" />
        </button>
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-surface-line bg-surface shadow-xl p-1.5">
            <p className="px-3 py-2 text-sm font-medium truncate">{profile?.display_name}</p>
            <Link href="/profile" className="block px-3 py-2 rounded-xl text-sm hover:bg-background/40">
              View profile
            </Link>
            <Link href="/settings" className="block px-3 py-2 rounded-xl text-sm hover:bg-background/40">
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-accent hover:bg-accent/10 text-left"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
