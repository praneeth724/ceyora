import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, badRequest, json, serverError } from "@/lib/api";
import { destinationSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

export async function GET() {
  const auth = await requirePermission("destinations");
  if (auth instanceof NextResponse) return auth;
  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { packages: true } } },
  });
  return json(destinations);
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("destinations");
  if (auth instanceof NextResponse) return auth;

  const parsed = destinationSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });
  const d = parsed.data;

  try {
    const slug = await uniqueSlug(d.name, async (s) =>
      Boolean(await prisma.destination.findUnique({ where: { slug: s } })),
    );
    const destination = await prisma.destination.create({
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
    return json(destination, 201);
  } catch (err) {
    console.error("destination create", err);
    return serverError();
  }
}
