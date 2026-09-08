import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, badRequest, json, notFound, serverError } from "@/lib/api";
import { packageSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requirePermission("packages");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: { category: true, destinations: { select: { id: true, name: true } } },
  });
  if (!pkg) return notFound();
  return json(pkg);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await requirePermission("packages");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);

  const existing = await prisma.package.findUnique({ where: { id } });
  if (!existing) return notFound();

  const parsed = packageSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });
  const p = parsed.data;

  try {
    const slug = await uniqueSlug(p.title, async (s) => {
      const found = await prisma.package.findUnique({ where: { slug: s } });
      return Boolean(found && found.id !== id);
    });
    const pkg = await prisma.package.update({
      where: { id },
      data: {
        title: p.title,
        slug,
        summary: p.summary || null,
        badge: p.badge || null,
        days: p.days,
        nights: p.nights,
        price: p.price,
        dealPercent: p.dealPercent ?? null,
        dealPrice: p.dealPrice ?? null,
        isFeatured: p.isFeatured,
        heroImage: p.heroImage || null,
        overview: p.overview || null,
        gallery: p.gallery ?? [],
        journey: p.journey ?? [],
        route: p.route ?? [],
        included: p.included ?? [],
        excluded: p.excluded ?? [],
        faq: p.faq ?? [],
        categoryId: p.categoryId ?? null,
        destinations: { set: (p.destinationIds ?? []).map((did) => ({ id: did })) },
      },
      include: { category: true, destinations: true },
    });
    return json(pkg);
  } catch (err) {
    console.error("package update", err);
    return serverError();
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requirePermission("packages");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  try {
    await prisma.package.delete({ where: { id } });
    return json({ ok: true });
  } catch {
    return notFound();
  }
}
