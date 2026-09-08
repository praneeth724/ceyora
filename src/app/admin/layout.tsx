import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SidebarBrand, SidebarNav } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-white dark:bg-slate-900 lg:flex">
        <SidebarBrand />
        <div className="flex-1 overflow-y-auto">
          <SidebarNav user={user} />
        </div>
      </aside>

      <div className="lg:pl-64">
        <Topbar user={user} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
