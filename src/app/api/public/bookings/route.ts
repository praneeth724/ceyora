import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json, serverError } from "@/lib/api";
import { publicBookingSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const parsed = publicBookingSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Please fill in all required fields correctly");
  const d = parsed.data;
  try {
    // Resolve package name if an id was supplied.
    let packageName = d.packageName || null;
    if (d.packageId) {
      const pkg = await prisma.package.findUnique({ where: { id: d.packageId } });
      if (pkg) packageName = pkg.title;
    }
    await prisma.booking.create({
      data: {
        name: d.name,
        email: d.email,
        phone: d.phone || null,
        country: d.country || null,
        travelers: d.travelers ?? null,
        arrivalDate: d.arrivalDate || null,
        returnDate: d.returnDate || null,
        message: d.message || null,
        packageId: d.packageId ?? null,
        packageName,
      },
    });
    return json({ ok: true }, 201);
  } catch (err) {
    console.error("public booking", err);
    return serverError();
  }
}
