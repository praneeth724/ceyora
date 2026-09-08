import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, badRequest, json, serverError } from "@/lib/api";
import { settingsSchema } from "@/lib/validators";

export async function GET() {
  const auth = await requirePermission("settings");
  if (auth instanceof NextResponse) return auth;
  const setting = await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return json(setting);
}

export async function PUT(req: NextRequest) {
  const auth = await requirePermission("settings");
  if (auth instanceof NextResponse) return auth;

  const parsed = settingsSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });
  const s = parsed.data;

  const data = {
    siteName: s.siteName,
    tagline: s.tagline || null,
    logoFull: s.logoFull || null,
    logoMark: s.logoMark || null,
    logoWord: s.logoWord || null,
    favicon: s.favicon || null,
    heroImage: s.heroImage || null,
    email: s.email || null,
    phone: s.phone || null,
    address: s.address || null,
    whatsapp: s.whatsapp || null,
    facebook: s.facebook || null,
    instagram: s.instagram || null,
    twitter: s.twitter || null,
    youtube: s.youtube || null,
  };

  try {
    const setting = await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
    return json(setting);
  } catch (err) {
    console.error("settings update", err);
    return serverError();
  }
}
