import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin, badRequest, json, serverError } from "@/lib/api";
import { createAdminSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/password";
import { ALL_PERMISSION_KEYS } from "@/lib/permissions";

const selectSafe = {
  id: true,
  name: true,
  email: true,
  role: true,
  access: true,
  isActive: true,
  createdAt: true,
} as const;

export async function GET() {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;
  const admins = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: selectSafe,
  });
  return json(admins);
}

export async function POST(req: NextRequest) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  const parsed = createAdminSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });
  const a = parsed.data;

  const email = a.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return badRequest("An account with this email already exists");

  // Only keep valid permission keys.
  const access = a.access.filter((k) => ALL_PERMISSION_KEYS.includes(k as never));

  try {
    const created = await prisma.user.create({
      data: {
        name: a.name,
        email,
        password: await hashPassword(a.password),
        role: a.role,
        access: a.role === "SUPER_ADMIN" ? [] : access,
        isActive: a.isActive,
      },
      select: selectSafe,
    });
    return json(created, 201);
  } catch (err) {
    console.error("admin create", err);
    return serverError();
  }
}
