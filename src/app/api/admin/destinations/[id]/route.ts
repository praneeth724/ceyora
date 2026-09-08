import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, badRequest, json, notFound, serverError } from "@/lib/api";
import { destinationSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requirePermission("destinations");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  const destination = await prisma.destination.findUnique({ where: { id } });
  if (!destination) return notFound();
  return json(destination);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await requirePermission("destinations");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);

  const existing = await prisma.destination.findUnique({ where: { id } });
  if (!existing) return notFound();

  const parsed = destinationSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });
  const d = parsed.data;

  try {
    const slug = await uniqueSlug(d.name, async (s) => {
      const found = await prisma.destination.findUnique({ where: { slug: s } });
      return Boolean(found && found.id !== id);
    });
    const destination = await prisma.destination.update({
      where: { id },
      data: {
        name: d.name,
        slug,
        tag: d.tag || null,
        subtitle: d.subtitle || null,
        description: d.description,
        shortDesc: d.shortDesc || null,
        hero: d.hero || null,
        gallery: d.gallery ?? [],
        rating: d.rating || null,
        pinTop: d.pinTop || null,
        pinLeft: d.pinLeft || null,
        isFeatured: d.isFeatured,
      },
    });
    return json(destination);
  } catch (err) {
    console.error("destination update", err);
    return serverError();
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requirePermission("destinations");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  try {
    await prisma.destination.delete({ where: { id } });
    return json({ ok: true });
  } catch {
    return notFound();
  }
}
