import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { IMG } from "@/lib/site-images";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({ where: { slug } });
  return { title: post?.title ?? "Post" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({ where: { slug } });
  if (!post || !post.isPublished) notFound();

  const more = await prisma.blog.findMany({
    where: { isPublished: true, slug: { not: slug } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const paras = post.content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const date = new Date(post.publishedAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
  const heroBg = post.coverImage || IMG.teaHills;
  const initial = (post.author || "C").charAt(0).toUpperCase();

  return (
    <article>
      {/* Hero */}
      <section style={{ position: "relative", height: 520, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${heroBg}')`, backgroundSize: "cover", backgroundPosition: "center", animation: "kb 20s ease-out infinite alternate" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.97) 5%, rgba(4,30,40,.4) 60%, rgba(4,30,40,.7))" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "0 32px 56px", width: "100%" }}>
          <Link href="/blog" style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--txt-mid)" }}>← All stories</Link>
          {post.category && <div className="site-eyebrow" style={{ margin: "22px 0 14px" }}>{post.category}</div>}
          <h1 className="site-serif" style={{ fontSize: "clamp(30px,4.5vw,52px)", lineHeight: 1.1, margin: "0 0 20px", fontWeight: 500, color: "#F2FAFF" }}>{post.title}</h1>
          <div style={{ display: "flex", gap: 26, flexWrap: "wrap", fontSize: 13, color: "var(--txt)" }}>
            {post.author && <span>{post.author}</span>}
            <span>{date}</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "64px 32px 24px" }}>
        {post.excerpt && (
          <p className="site-serif" style={{ fontSize: 24, lineHeight: 1.6, color: "var(--head-2)", margin: "0 0 36px" }}>{post.excerpt}</p>
        )}
        {paras.map((p, i) => {
          const isQuote = /^[“"']/.test(p);
          return isQuote ? (
            <blockquote key={i} className="site-serif" style={{ margin: "44px 0", padding: "32px 0 32px 34px", borderLeft: "2px solid var(--gold)", fontStyle: "italic", fontSize: 26, lineHeight: 1.5, color: "var(--head-2)" }}>{p.replace(/^["“]|["”]$/g, "")}</blockquote>
          ) : (
            <p key={i} style={{ fontSize: 16, lineHeight: 1.95, color: "var(--txt)", margin: "0 0 26px" }}>{p}</p>
          );
        })}

        {/* Author card */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: 26, border: "1px solid var(--bd-soft)", borderRadius: 16, background: "var(--panel)", marginBottom: 20, flexWrap: "wrap" }}>
          <span className="site-serif" style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(2,136,209,.16)", border: "1px solid rgba(2,136,209,.4)", display: "grid", placeItems: "center", fontSize: 22, color: "var(--gold)" }}>{initial}</span>
          <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 15, color: "var(--head-2)" }}>{post.author || "Ceyora Team"}</span>
            <span style={{ fontSize: 12.5, color: "var(--txt-mid)" }}>Ceyora Travels</span>
          </span>
          <Link href="/contact" className="btn-ghost" style={{ marginLeft: "auto" }}>Ask a question</Link>
        </div>
      </section>

      {/* Keep reading */}
      {more.length > 0 && (
        <section className="site-container" style={{ padding: "40px 0 110px" }}>
          <h2 className="site-serif" style={{ fontSize: 32, margin: "0 0 24px", fontWeight: 500, color: "var(--head)" }}>Keep reading</h2>
          <div className="grid-3" style={{ gap: 18 }}>
            {more.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} style={{ position: "relative", height: 250, borderRadius: "54px 18px 18px 18px", overflow: "hidden", border: "1px solid var(--bd-soft)", display: "block" }}>
                <span style={{ position: "absolute", inset: 0, backgroundImage: `url('${p.coverImage || "/site/hero.jpg"}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.95) 5%, transparent 65%)" }} />
                <span style={{ position: "absolute", left: 18, right: 18, bottom: 18, display: "flex", flexDirection: "column", gap: 7 }}>
                  <span style={{ fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gold)" }}>{p.category}</span>
                  <span className="site-serif" style={{ fontSize: 19, lineHeight: 1.3, color: "#F2FAFF" }}>{p.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
