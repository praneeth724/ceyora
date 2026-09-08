import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, badRequest, json, notFound, serverError } from "@/lib/api";
import { blogSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requirePermission("blogs");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) return notFound();
  return json(blog);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await requirePermission("blogs");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);

  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) return notFound();

  const parsed = blogSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });
  const b = parsed.data;

  try {
    const slug = await uniqueSlug(b.title, async (s) => {
      const found = await prisma.blog.findUnique({ where: { slug: s } });
      return Boolean(found && found.id !== id);
    });
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: b.title,
        slug,
        category: b.category || null,
        excerpt: b.excerpt || null,
        content: b.content,
        coverImage: b.coverImage || null,
        author: b.author || null,
        isPublished: b.isPublished,
      },
    });
    return json(blog);
  } catch (err) {
    console.error("blog update", err);
    return serverError();
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requirePermission("blogs");
  if (auth instanceof NextResponse) return auth;
  const id = Number((await params).id);
  try {
    await prisma.blog.delete({ where: { id } });
    return json({ ok: true });
  } catch {
    return notFound();
  }
}
