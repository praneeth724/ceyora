import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, badRequest, json, notFound } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

const STATUSES = ["NEW", "READ", "RESPONDED", "CLOSED"] as const;

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requirePermission("inquiries");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (!STATUSES.includes(status)) return badRequest("Invalid status");
  try {
    const updated = await prisma.inquiry.update({ where: { id }, data: { status } });
    return json(updated);
  } catch {
    return notFound();
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requirePermission("inquiries");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  try {
    await prisma.inquiry.delete({ where: { id } });
    return json({ ok: true });
  } catch {
    return notFound();
  }
}
