import { prisma } from "@/lib/prisma";
import { BlogList } from "@/components/site/blog-list";

export const metadata = { title: "Journal" };

export default async function BlogListPage() {
  const posts = await prisma.blog.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <section className="site-container" style={{ padding: "120px 0 40px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div className="site-eyebrow" style={{ marginBottom: 14 }}>The journal</div>
            <h1 className="site-serif" style={{ fontSize: "clamp(38px,6vw,58px)", margin: 0, fontWeight: 500, color: "var(--head)" }}>Stories &amp; Travel Notes</h1>
          </div>
          <p style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--txt-mid)", maxWidth: 400, margin: 0 }}>Guides, field notes and news from our team on the island — written by the people who lead the trips.</p>
        </div>
      </section>
      <BlogList
        posts={posts.map((p) => ({
          slug: p.slug, title: p.title, excerpt: p.excerpt, coverImage: p.coverImage,
          category: p.category, author: p.author, date: new Date(p.publishedAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }),
        }))}
      />
    </div>
  );
}
