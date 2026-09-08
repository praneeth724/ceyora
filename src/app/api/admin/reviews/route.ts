import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, badRequest, json, serverError } from "@/lib/api";
import { reviewSchema } from "@/lib/validators";

export async function GET() {
  const auth = await requirePermission("reviews");
  if (auth instanceof NextResponse) return auth;
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  return json(reviews);
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("reviews");
  if (auth instanceof NextResponse) return auth;

  const parsed = reviewSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });
  const r = parsed.data;

  try {
    const review = await prisma.review.create({
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
    return json(review, 201);
  } catch (err) {
    console.error("review create", err);
    return serverError();
  }
}
