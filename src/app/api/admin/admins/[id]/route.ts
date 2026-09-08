import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin, badRequest, json, notFound, forbidden, serverError } from "@/lib/api";
import { updateAdminSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/password";
import { ALL_PERMISSION_KEYS, type SessionUser } from "@/lib/permissions";

type Params = { params: Promise<{ id: string }> };

const selectSafe = {
  id: true,
  name: true,
  email: true,
  role: true,
  access: true,
  isActive: true,
  createdAt: true,
} as const;

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;
  const me = auth as SessionUser;
  const id = Number((await params).id);

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return notFound();

  const parsed = updateAdminSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });
  const a = parsed.data;

  // Guard: don't let a super admin lock themselves out.
  if (id === me.id) {
    if (a.role && a.role !== "SUPER_ADMIN") return forbidden();
    if (a.isActive === false) return forbidden();
  }

  const data: Record<string, unknown> = {};
  if (a.name !== undefined) data.name = a.name;
  if (a.role !== undefined) data.role = a.role;
  if (a.isActive !== undefined) data.isActive = a.isActive;
  if (a.access !== undefined) {
    const role = a.role ?? existing.role;
    data.access =
      role === "SUPER_ADMIN"
        ? []
        : a.access.filter((k) => ALL_PERMISSION_KEYS.includes(k as never));
  }
  if (a.password) data.password = await hashPassword(a.password);

  try {
    const updated = await prisma.user.update({ where: { id }, data, select: selectSafe });
    return json(updated);
  } catch (err) {
    console.error("admin update", err);
    return serverError();
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;
  const me = auth as SessionUser;
  const id = Number((await params).id);

  if (id === me.id) return badRequest("You cannot delete your own account");

  try {
    await prisma.user.delete({ where: { id } });
    return json({ ok: true });
  } catch {
    return notFound();
  }
}
