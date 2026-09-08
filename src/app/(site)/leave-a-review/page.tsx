import { getSiteSettings } from "@/lib/site";
import { LeaveReviewForm } from "@/components/site/leave-review-form";

export const metadata = { title: "Leave a Review" };

const IMG = "https://commons.wikimedia.org/wiki/Special:FilePath/Sri_Lanka_tea_plantation.jpg?width=1400";

export default async function LeaveReviewPage() {
  const s = await getSiteSettings();
  return (
    <section className="site-container" style={{ paddingTop: 120, paddingBottom: 90 }}>
      <div className="grid-2" style={{ gap: 40, alignItems: "stretch" }}>
        {/* Visual side */}
        <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", minHeight: 420, display: "flex", alignItems: "flex-end" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${IMG}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.95), rgba(4,30,40,.2))" }} />
          <div style={{ position: "relative", padding: 40 }}>
            <span className="site-serif" style={{ fontSize: 76, lineHeight: 1, color: "rgba(2,136,209,.5)" }}>&ldquo;</span>
            <p className="site-serif" style={{ fontSize: "clamp(24px,3vw,32px)", lineHeight: 1.4, color: "#F2FAFF", margin: "8px 0 0" }}>
              Every trip tells a story. Yours could be the reason someone else books their first journey to Sri Lanka.
            </p>
            <div style={{ marginTop: 24, display: "grid", gap: 8, fontSize: 13.5, color: "rgba(214,236,247,.85)" }}>
              <span>◈ Handpicked routes across the island</span>
              <span>◎ Trusted by travellers from 40+ countries</span>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div style={{ padding: "8px 4px" }}>
          <div className="site-eyebrow" style={{ marginBottom: 10 }}>{s.siteName}</div>
          <h1 className="site-serif" style={{ fontSize: "clamp(30px,4vw,42px)", margin: "0 0 6px", fontWeight: 500, color: "var(--head)" }}>Share Your Journey</h1>
          <p style={{ color: "var(--txt-mid)", margin: "0 0 26px" }}>Tell future travellers about your experience with us.</p>
          <LeaveReviewForm />
        </div>
      </div>
    </section>
  );
}
