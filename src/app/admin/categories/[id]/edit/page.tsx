import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { CategoryForm } from "@/components/admin/categories/category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await guardPage("categories");
  const id = Number((await params).id);
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <PageHeader title="Edit Category" description={category.title} />
      <CategoryForm
        initial={{
          id: category.id,
          title: category.title,
          description: category.description,
          coverImage: category.coverImage,
          cardImage: category.cardImage,
          isPopular: category.isPopular,
          sortOrder: category.sortOrder,
        }}
      />
    </div>
  );
}
