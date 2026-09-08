"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/admin-nav";
import { can, canManageAdmins, type SessionUser } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export function SidebarNav({
  user,
  onNavigate,
}: {
  user: SessionUser;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const visible = NAV_ITEMS.filter((item) => {
    if (item.gate === "always") return true;
    if (item.gate === "super") return canManageAdmins(user);
    return can(user, item.gate);
  });

  return (
    <nav className="flex flex-col gap-1 p-3">
      {visible.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sky-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-2 border-b px-5 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-sm font-bold text-white">
        C
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold">Ceyora</p>
        <p className="text-[11px] text-slate-500">Admin Panel</p>
      </div>
    </div>
  );
}
