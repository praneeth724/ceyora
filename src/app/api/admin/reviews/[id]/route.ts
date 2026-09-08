import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, badRequest, json, notFound, serverError } from "@/lib/api";
import { reviewSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };
const STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await requirePermission("reviews");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) return notFound();

  const parsed = reviewSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });
  const r = parsed.data;
  try {
    const review = await prisma.review.update({
      where: { id },
      data: {
        name: r.name,
        country: r.country || null,
        category: r.category || null,
        rating: r.rating,
        message: r.message,
        profileImg: r.profileImg || null,
        photos: r.photos ?? [],
        status: r.status,
      },
    });
    return json(review);
  } catch (err) {
    console.error("review update", err);
    return serverError();
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requirePermission("reviews");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (!STATUSES.includes(status)) return badRequest("Invalid status");
  try {
    const updated = await prisma.review.update({ where: { id }, data: { status } });
    return json(updated);
  } catch {
    return notFound();
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requirePermission("reviews");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  try {
    await prisma.review.delete({ where: { id } });
    return json({ ok: true });
  } catch {
    return notFound();
  }
}
