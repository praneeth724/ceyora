"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarBrand, SidebarNav } from "./sidebar";
import { LogoutButton } from "./logout-button";
import type { SessionUser } from "@/lib/permissions";

export function Topbar({
  user,
  logo,
  siteName = "Ceyora",
}: {
  user: SessionUser;
  logo?: string | null;
  siteName?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const initials = user.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white/80 px-4 backdrop-blur dark:bg-slate-950/80">
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu" />}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="flex w-64 flex-col p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarBrand logo={logo} siteName={siteName} />
            <div className="flex-1 overflow-y-auto">
              <SidebarNav user={user} onNavigate={() => setOpen(false)} />
            </div>
            <div className="border-t p-3">
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>
        <span className="text-sm font-medium text-slate-500">
          {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2 px-2" />}>
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-sky-600 text-xs text-white">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm sm:inline">{user.name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
