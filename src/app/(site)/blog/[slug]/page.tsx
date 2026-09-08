import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({ where: { slug } });
  return { title: post?.title ?? "Post" };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({ where: { slug } });
  if (!post || !post.isPublished) notFound();

  return (
    <article>
      <section style={{ position: "relative", minHeight: 380, display: "flex", alignItems: "flex-end", overflow: "hidden", background: "linear-gradient(135deg,#062c3a,#041e28)" }}>
        {post.coverImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(2,12,18,.4), rgba(4,30,40,.95))" }} />
          </>
        )}
        <div className="site-container" style={{ position: "relative", paddingTop: 140, paddingBottom: 40, maxWidth: 820 }}>
          <div className="site-eyebrow" style={{ marginBottom: 12 }}>
            {post.category || "Journal"} · {new Date(post.publishedAt).toLocaleDateString()}
            {post.author ? ` · ${post.author}` : ""}
          </div>
          <h1 className="site-serif" style={{ fontSize: "clamp(30px,4.5vw,52px)", color: "#F2FAFF", margin: 0, lineHeight: 1.1 }}>
            {post.title}
          </h1>
        </div>
      </section>

      <section className="site-container" style={{ paddingTop: 44, maxWidth: 760 }}>
        {post.excerpt && (
          <p style={{ fontSize: 18, color: "var(--head-2)", lineHeight: 1.6, marginTop: 0 }}>{post.excerpt}</p>
        )}
        <div className="site-prose" style={{ fontSize: 16 }}>{post.content}</div>
        <div style={{ marginTop: 40 }}>
          <Link href="/blog" className="btn-ghost">← Back to journal</Link>
        </div>
      </section>
    </article>
  );
}
