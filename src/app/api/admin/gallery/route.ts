import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, badRequest, json, serverError } from "@/lib/api";
import { gallerySchema } from "@/lib/validators";

export async function GET() {
  const auth = await requirePermission("gallery");
  if (auth instanceof NextResponse) return auth;
  const images = await prisma.galleryImage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return json(images);
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("gallery");
  if (auth instanceof NextResponse) return auth;
  const parsed = gallerySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });
  const g = parsed.data;
  try {
    const image = await prisma.galleryImage.create({
      data: { title: g.title || null, image: g.image, sortOrder: g.sortOrder },
    });
    return json(image, 201);
  } catch (err) {
    console.error("gallery create", err);
    return serverError();
  }
}
