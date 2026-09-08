import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, signToken, verifyToken } from "./auth";
import type { SessionUser } from "./permissions";

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Read and verify the current session from the request cookie. */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Create the session cookie for a user. */
export async function setSession(user: SessionUser): Promise<void> {
  const token = await signToken(user);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Clear the session cookie (logout). */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
