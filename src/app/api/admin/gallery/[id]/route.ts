import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, json, notFound } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requirePermission("gallery");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  try {
    await prisma.galleryImage.delete({ where: { id } });
    return json({ ok: true });
  } catch {
    return notFound();
  }
}
