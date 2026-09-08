import {
  LayoutDashboard,
  FolderTree,
  Package,
  MapPin,
  Newspaper,
  Images,
  Star,
  Mail,
  CalendarCheck,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { PermissionKey } from "./permissions";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  // "always" = every admin, "super" = super admin only, otherwise a permission key.
  gate: "always" | "super" | PermissionKey;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, gate: "always" },
  { href: "/admin/categories", label: "Categories", icon: FolderTree, gate: "categories" },
  { href: "/admin/packages", label: "Packages", icon: Package, gate: "packages" },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin, gate: "destinations" },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper, gate: "blogs" },
  { href: "/admin/gallery", label: "Gallery", icon: Images, gate: "gallery" },
  { href: "/admin/reviews", label: "Reviews", icon: Star, gate: "reviews" },
  { href: "/admin/inquiries", label: "Inquiries", icon: Mail, gate: "inquiries" },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, gate: "bookings" },
  { href: "/admin/settings", label: "Site Settings", icon: Settings, gate: "settings" },
  { href: "/admin/admins", label: "Admins", icon: ShieldCheck, gate: "super" },
];
