import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, badRequest, json, serverError } from "@/lib/api";
import { blogSchema } from "@/lib/validators";
import { uniqueSlug } from "@/lib/slug";

export async function GET() {
  const auth = await requirePermission("blogs");
  if (auth instanceof NextResponse) return auth;
  const blogs = await prisma.blog.findMany({ orderBy: { publishedAt: "desc" } });
  return json(blogs);
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("blogs");
  if (auth instanceof NextResponse) return auth;

  const parsed = blogSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest("Invalid data", { issues: parsed.error.flatten() });
  const b = parsed.data;

  try {
    const slug = await uniqueSlug(b.title, async (s) =>
      Boolean(await prisma.blog.findUnique({ where: { slug: s } })),
    );
    const blog = await prisma.blog.create({
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
    return json(blog, 201);
  } catch (err) {
    console.error("blog create", err);
    return serverError();
  }
}
