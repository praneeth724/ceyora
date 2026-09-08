import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { BlogForm } from "@/components/admin/blogs/blog-form";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await guardPage("blogs");
  const id = Number((await params).id);
  const b = await prisma.blog.findUnique({ where: { id } });
  if (!b) notFound();

  return (
    <div>
      <PageHeader title="Edit Post" description={b.title} />
      <BlogForm
        initial={{
          id: b.id,
          title: b.title,
          category: b.category,
          excerpt: b.excerpt,
          content: b.content,
          coverImage: b.coverImage,
          author: b.author,
          isPublished: b.isPublished,
        }}
      />
    </div>
  );
}
