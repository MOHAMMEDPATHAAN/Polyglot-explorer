import { redirect } from "next/navigation";
import { getProfile, getNotifications } from "@/lib/data";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { MobileNav } from "@/components/dashboard/MobileNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const notifications = await getNotifications();
  const isStaff = profile.role === "admin" || profile.role === "teacher";

  return (
    <div className="flex min-h-screen" data-mode={profile.preferred_mode}>
      <Sidebar isStaff={isStaff} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar profile={profile} notifications={notifications} />
        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
