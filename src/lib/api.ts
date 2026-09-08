import "server-only";
import { NextResponse } from "next/server";
import { getSession } from "./session";
import { can, canManageAdmins, type PermissionKey, type SessionUser } from "./permissions";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function badRequest(message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status: 400 });
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = "Something went wrong") {
  return NextResponse.json({ error: message }, { status: 500 });
}

/**
 * Require an authenticated admin. Returns the session user, or a NextResponse
 * to return early. Usage:
 *   const auth = await requireUser();
 *   if (auth instanceof NextResponse) return auth;
 */
export async function requireUser(): Promise<SessionUser | NextResponse> {
  const user = await getSession();
  if (!user) return unauthorized();
  return user;
}

/** Require an admin with a specific permission (super admins always pass). */
export async function requirePermission(
  key: PermissionKey,
): Promise<SessionUser | NextResponse> {
  const user = await getSession();
  if (!user) return unauthorized();
  if (!can(user, key)) return forbidden();
  return user;
}

/** Require a super admin (for managing other admins). */
export async function requireSuperAdmin(): Promise<SessionUser | NextResponse> {
  const user = await getSession();
  if (!user) return unauthorized();
  if (!canManageAdmins(user)) return forbidden();
  return user;
}
