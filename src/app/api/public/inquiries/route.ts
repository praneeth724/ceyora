import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest, json, serverError } from "@/lib/api";
import { publicInquirySchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const parsed = publicInquirySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Please fill in all required fields correctly");
  const d = parsed.data;
  try {
    await prisma.inquiry.create({
      data: {
        name: d.name,
        email: d.email,
        phone: d.phone || null,
        subject: d.subject || null,
        message: d.message,
      },
    });
    return json({ ok: true }, 201);
  } catch (err) {
    console.error("public inquiry", err);
    return serverError();
  }
}
