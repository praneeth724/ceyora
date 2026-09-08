import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, badRequest, json, serverError } from "@/lib/api";
import { packageSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

export async function GET() {
  const auth = await requirePermission("packages");
  if (auth instanceof NextResponse) return auth;
  const packages = await prisma.package.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, title: true } },
      destinations: { select: { id: true, name: true } },
    },
  });
  return json(packages);
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("packages");
  if (auth instanceof NextResponse) return auth;

  const parsed = packageSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });
  const p = parsed.data;

  try {
    const slug = await uniqueSlug(p.title, async (s) =>
      Boolean(await prisma.package.findUnique({ where: { slug: s } })),
    );
    const pkg = await prisma.package.create({
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
        destinations: p.destinationIds?.length
          ? { connect: p.destinationIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { category: true, destinations: true },
    });
    return json(pkg, 201);
  } catch (err) {
    console.error("package create", err);
    return serverError();
  }
}
