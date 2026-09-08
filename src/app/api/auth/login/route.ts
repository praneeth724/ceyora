import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { setSession } from "@/lib/session";
import { badRequest, json, serverError } from "@/lib/api";
import type { SessionUser } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!email || !password) {
      return badRequest("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return badRequest("Invalid credentials");
    }

    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      return badRequest("Invalid credentials");
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      access: Array.isArray(user.access) ? (user.access as string[]) : [],
    };
    await setSession(sessionUser);

    return json({ user: sessionUser });
  } catch (err) {
    console.error("login error", err);
    return serverError();
  }
}
