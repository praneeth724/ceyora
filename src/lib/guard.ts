import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import { can, canManageAdmins, type PermissionKey, type SessionUser } from "./permissions";

/** Get the current admin, redirecting to login if absent. */
export async function pageUser(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

/** Require a permission to view a section; redirect to the dashboard otherwise. */
export async function guardPage(key: PermissionKey): Promise<SessionUser> {
  const user = await pageUser();
  if (!can(user, key)) redirect("/admin");
  return user;
}

/** Require super admin to view a section. */
export async function guardSuperAdmin(): Promise<SessionUser> {
  const user = await pageUser();
  if (!canManageAdmins(user)) redirect("/admin");
  return user;
}
