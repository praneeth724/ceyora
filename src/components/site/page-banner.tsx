export function PageBanner({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section
      style={{
        borderBottom: "1px solid var(--bd-soft)",
        background: "linear-gradient(135deg, #062c3a, #041e28)",
      }}
    >
      <div className="site-container" style={{ paddingTop: 130, paddingBottom: 56, textAlign: "center" }}>
        {eyebrow && <div className="site-eyebrow" style={{ marginBottom: 14 }}>{eyebrow}</div>}
        <h1 className="site-serif" style={{ fontSize: "clamp(34px,5vw,58px)", color: "var(--head)", margin: 0, lineHeight: 1.05 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ maxWidth: 620, margin: "18px auto 0", color: "var(--txt-mid)", fontSize: 15.5, lineHeight: 1.7 }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
