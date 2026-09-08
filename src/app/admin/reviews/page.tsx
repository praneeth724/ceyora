import { prisma } from "@/lib/prisma";
import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { ReviewsManager } from "@/components/admin/reviews/reviews-manager";

export default async function ReviewsPage() {
  await guardPage("reviews");
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Reviews" description="Collect, approve and showcase guest reviews." />
      <ReviewsManager
        reviews={reviews.map((r) => ({
          id: r.id,
          name: r.name,
          country: r.country,
          category: r.category,
          rating: r.rating,
          message: r.message,
          status: r.status,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
