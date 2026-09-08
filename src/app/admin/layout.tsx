import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getSiteSettings } from "@/lib/site";
import { SidebarBrand, SidebarNav } from "@/components/admin/sidebar";
import { LogoutButton } from "@/components/admin/logout-button";
import { Topbar } from "@/components/admin/topbar";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");
  const settings = await getSiteSettings();
  const logo = settings.logoFull || settings.logoMark || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-white dark:bg-slate-900 lg:flex">
        <SidebarBrand logo={logo} siteName={settings.siteName} />
        <div className="flex-1 overflow-y-auto">
          <SidebarNav user={user} />
        </div>
        <div className="border-t p-3">
          <LogoutButton />
        </div>
      </aside>

      <div className="lg:pl-64">
        <Topbar user={user} logo={logo} siteName={settings.siteName} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
