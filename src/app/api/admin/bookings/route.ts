import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, json } from "@/lib/api";

export async function GET() {
  const auth = await requirePermission("bookings");
  if (auth instanceof NextResponse) return auth;
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { package: { select: { id: true, title: true } } },
  });
  return json(bookings);
}
