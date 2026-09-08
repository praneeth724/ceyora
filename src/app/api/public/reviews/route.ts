import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json, serverError } from "@/lib/api";
import { publicReviewSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const parsed = publicReviewSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Please fill in all required fields correctly");
  const r = parsed.data;
  try {
    // Public submissions start as PENDING until an admin approves them.
    await prisma.review.create({
      data: {
        name: r.name,
        country: r.country || null,
        category: r.category || null,
        rating: r.rating,
        message: r.message,
        profileImg: r.profileImg || null,
        photos: r.photos ?? [],
        status: "PENDING",
      },
    });
    return json({ ok: true }, 201);
  } catch (err) {
    console.error("public review", err);
    return serverError();
  }
}
