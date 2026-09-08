import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, json } from "@/lib/api";

export async function GET() {
  const auth = await requirePermission("inquiries");
  if (auth instanceof NextResponse) return auth;
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  return json(inquiries);
}
