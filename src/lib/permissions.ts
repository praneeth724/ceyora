// Permission keys used to gate admin sections. SUPER_ADMIN implicitly has all
// of these plus the exclusive "admins" management capability.

export const PERMISSIONS = [
  { key: "categories", label: "Categories" },
  { key: "packages", label: "Packages" },
  { key: "destinations", label: "Destinations" },
  { key: "blogs", label: "Blogs" },
  { key: "reviews", label: "Reviews" },
  { key: "inquiries", label: "Inquiries" },
  { key: "bookings", label: "Bookings" },
  { key: "settings", label: "Site Settings" },
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number]["key"];

export const ALL_PERMISSION_KEYS = PERMISSIONS.map((p) => p.key) as PermissionKey[];

export type Role = "SUPER_ADMIN" | "ADMIN";

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: Role;
  access: string[];
}

/** Does this user have access to a given permission key? */
export function can(user: SessionUser | null | undefined, key: PermissionKey): boolean {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN") return true;
  return Array.isArray(user.access) && user.access.includes(key);
}

/** Only super admins can manage other admins. */
export function canManageAdmins(user: SessionUser | null | undefined): boolean {
  return user?.role === "SUPER_ADMIN";
}
