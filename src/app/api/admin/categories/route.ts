import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, badRequest, json, serverError } from "@/lib/api";
import { categorySchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

export async function GET() {
  const auth = await requirePermission("categories");
  if (auth instanceof NextResponse) return auth;

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { packages: true } } },
  });
  return json(categories);
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("categories");
  if (auth instanceof NextResponse) return auth;

  const parsed = categorySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });

  const data = parsed.data;
  try {
    const slug = await uniqueSlug(data.title, async (s) =>
      Boolean(await prisma.category.findUnique({ where: { slug: s } })),
    );
    const category = await prisma.category.create({
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
    return json(category, 201);
  } catch (err) {
    console.error("category create", err);
    return serverError();
  }
}
