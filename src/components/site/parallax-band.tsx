import Link from "next/link";

/**
 * A fixed-background parallax band (GeeksforGeeks-style): the image stays pinned
 * to the viewport while the content scrolls over it. Purely CSS driven via the
 * `.parallax-band` class (background-attachment: fixed), so no JS is needed.
 */
export function ParallaxBand({
  image,
  eyebrow,
  title,
  text,
  ctaHref,
  ctaLabel,
  align = "center",
  minHeight = 460,
}: {
  image: string;
  eyebrow?: string;
  title: React.ReactNode;
  text?: string;
  ctaHref?: string;
  ctaLabel?: string;
  align?: "center" | "left";
  minHeight?: number;
}) {
  const centered = align === "center";
  return (
    <section
      className="parallax-band"
      style={{ minHeight, backgroundImage: `url('${image}')`, display: "flex", alignItems: "center", padding: "96px 0" }}
    >
      <span className="parallax-scrim" />
      <div
        className="parallax-inner site-container"
        style={{ width: "100%", textAlign: centered ? "center" : "left" }}
      >
        {eyebrow && <div className="site-eyebrow" style={{ marginBottom: 14 }}>{eyebrow}</div>}
        <h2
          className="site-serif"
          style={{
            fontSize: "clamp(30px,4.5vw,52px)",
            lineHeight: 1.12,
            fontWeight: 500,
            margin: 0,
            maxWidth: centered ? 860 : 640,
            marginInline: centered ? "auto" : 0,
          }}
        >
          {title}
        </h2>
        {text && (
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              maxWidth: 580,
              margin: centered ? "18px auto 0" : "18px 0 0",
            }}
          >
            {text}
          </p>
        )}
        {ctaHref && ctaLabel && (
          <div style={{ marginTop: 28, display: "flex", justifyContent: centered ? "center" : "flex-start" }}>
            <Link href={ctaHref} className="btn-primary">
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
