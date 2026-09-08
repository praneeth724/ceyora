import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, badRequest, json, notFound, serverError } from "@/lib/api";
import { categorySchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requirePermission("categories");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { packages: true } } },
  });
  if (!category) return notFound();
  return json(category);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await requirePermission("categories");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return notFound();

  const parsed = categorySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });
  const data = parsed.data;

  try {
    const slug = await uniqueSlug(data.title, async (s) => {
      const found = await prisma.category.findUnique({ where: { slug: s } });
      return Boolean(found && found.id !== id);
    });
    const category = await prisma.category.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        description: data.description,
        coverImage: data.coverImage || null,
        cardImage: data.cardImage || null,
        isPopular: data.isPopular,
        sortOrder: data.sortOrder,
      },
    });
    return json(category);
  } catch (err) {
    console.error("category update", err);
    return serverError();
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requirePermission("categories");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  try {
    await prisma.category.delete({ where: { id } });
    return json({ ok: true });
  } catch {
    return notFound();
  }
}
