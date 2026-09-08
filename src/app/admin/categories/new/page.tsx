import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { CategoryForm } from "@/components/admin/categories/category-form";

export default async function NewCategoryPage() {
  await guardPage("categories");
  return (
    <div>
      <PageHeader title="New Category" description="Add a tour category." />
      <CategoryForm />
    </div>
  );
}
