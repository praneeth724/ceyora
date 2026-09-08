import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { BlogForm } from "@/components/admin/blogs/blog-form";

export default async function NewBlogPage() {
  await guardPage("blogs");
  return (
    <div>
      <PageHeader title="New Post" description="Write a journal entry." />
      <BlogForm />
    </div>
  );
}
