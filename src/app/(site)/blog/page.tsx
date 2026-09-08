import { prisma } from "@/lib/prisma";
import { PageBanner } from "@/components/site/page-banner";
import { BlogCard } from "@/components/site/cards";

export const metadata = { title: "Journal" };

export default async function BlogListPage() {
  const posts = await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageBanner
        eyebrow="Stories & travel notes"
        title="The Journal"
        subtitle="Tips, guides and inspiration for your Sri Lankan adventure."
      />
      <section className="site-container" style={{ paddingTop: 48 }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--txt-mid)" }}>No posts yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {posts.map((b) => (
              <BlogCard key={b.id} post={{ slug: b.slug, title: b.title, excerpt: b.excerpt, coverImage: b.coverImage, category: b.category, publishedAt: b.publishedAt.toISOString() }} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
