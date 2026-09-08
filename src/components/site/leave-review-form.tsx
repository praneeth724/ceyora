"use client";

import { useState } from "react";

const TYPES = ["Solo", "Couple", "Family", "Group", "Friends", "Business"];

function Star({ filled, onClick, onHover, onLeave }: { filled: boolean; onClick: () => void; onHover: () => void; onLeave: () => void }) {
  return (
    <button type="button" onClick={onClick} onMouseEnter={onHover} onMouseLeave={onLeave} aria-label="rate" style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
      <svg viewBox="0 0 24 24" width="30" height="30" fill={filled ? "#F5A623" : "none"} stroke={filled ? "#F5A623" : "var(--txt-faint)"} strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </button>
  );
}

export function LeaveReviewForm() {
  const [form, setForm] = useState({ name: "", country: "", category: "", message: "" });
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function set(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError("Please choose a star rating."); setStatus("error"); return; }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/public/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); setStatus("error"); return; }
      setStatus("sent");
    } catch {
      setError("Network error. Please try again."); setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div style={{ padding: 40, borderRadius: 16, border: "1px solid var(--bd-soft)", background: "var(--panel)", textAlign: "center" }}>
        <p className="site-serif" style={{ fontSize: 26, color: "var(--head)", margin: 0 }}>Thank you for sharing!</p>
        <p style={{ color: "var(--txt-mid)", marginTop: 10, lineHeight: 1.7 }}>Your review has been submitted and will appear on our site once our team approves it.</p>
      </div>
    );
  }

  const active = hoverRating || rating;

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 18 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, color: "var(--txt-mid)", marginBottom: 6 }}>Your Name *</label>
        <input className="site-input" required placeholder="e.g. James Carter" value={form.name} onChange={(e) => set("name", e.target.value)} />
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))" }}>
        <div>
          <label style={{ display: "block", fontSize: 13, color: "var(--txt-mid)", marginBottom: 6 }}>Country</label>
          <input className="site-input" placeholder="Your country" value={form.country} onChange={(e) => set("country", e.target.value)} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, color: "var(--txt-mid)", marginBottom: 6 }}>Traveller Type</label>
          <select className="site-input" value={form.category} onChange={(e) => set("category", e.target.value)}>
            <option value="">Optional</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, color: "var(--txt-mid)", marginBottom: 6 }}>Your Rating *</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} filled={n <= active} onClick={() => setRating(n)} onHover={() => setHoverRating(n)} onLeave={() => setHoverRating(0)} />
          ))}
          <span style={{ marginLeft: 8, fontSize: 13, color: "var(--txt-faint)" }}>{active ? `${active} / 5` : "Tap to rate"}</span>
        </div>
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, color: "var(--txt-mid)", marginBottom: 6 }}>Your Review *</label>
        <textarea className="site-input" required rows={5} placeholder="How was your trip with us?" value={form.message} onChange={(e) => set("message", e.target.value)} />
      </div>
      {status === "error" && <p style={{ color: "#ff8a8a", fontSize: 14, margin: 0 }}>{error}</p>}
      <button type="submit" className="btn-primary" disabled={status === "sending"} style={{ justifyContent: "center", padding: "15px 26px" }}>
        {status === "sending" ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
