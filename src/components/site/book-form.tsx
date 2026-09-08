"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface PackageOption {
  id: number;
  title: string;
  price: number;
  dealPrice: number | null;
}

const fmt = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export function BookForm({
  packages,
  defaultPackageId,
}: {
  packages: PackageOption[];
  defaultPackageId?: number | null;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    arrivalDate: "",
    returnDate: "",
    packageId: defaultPackageId ? String(defaultPackageId) : "",
    message: "",
  });
  const [travelers, setTravelers] = useState(2);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function set(k: string, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  const selected = packages.find((p) => String(p.id) === form.packageId);
  const unit = selected ? (selected.dealPrice ?? selected.price) : 0;
  const total = unit * travelers;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/public/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          travelers,
          packageId: form.packageId ? Number(form.packageId) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div style={{ padding: 32, borderRadius: 16, border: "1px solid var(--bd-soft)", background: "var(--panel)", textAlign: "center" }}>
        <p className="site-serif" style={{ fontSize: 24, color: "var(--head)", margin: 0 }}>Booking request received!</p>
        <p style={{ color: "var(--txt-mid)", marginTop: 8 }}>
          Thanks for choosing us. Our team will contact you shortly to confirm the details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))" }}>
        <input className="site-input" placeholder="Full name *" required value={form.name} onChange={(e) => set("name", e.target.value)} />
        <input className="site-input" type="email" placeholder="Email *" required value={form.email} onChange={(e) => set("email", e.target.value)} />
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))" }}>
        <input className="site-input" placeholder="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <input className="site-input" placeholder="Country" value={form.country} onChange={(e) => set("country", e.target.value)} />
      </div>

      <div>
        <label style={{ display: "block", fontSize: 12.5, color: "var(--txt-mid)", marginBottom: 6 }}>Tour package</label>
        <select className="site-input" value={form.packageId} onChange={(e) => set("packageId", e.target.value)}>
          <option value="">Choose a package (optional)</option>
          {packages.map((p) => (
            <option key={p.id} value={p.id}>{p.title} — {fmt(p.dealPrice ?? p.price)} pp</option>
          ))}
        </select>
      </div>

      {/* Persons stepper + live total */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))" }}>
        <div>
          <label style={{ display: "block", fontSize: 12.5, color: "var(--txt-mid)", marginBottom: 6 }}>Number of persons</label>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "var(--input-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "8px 10px" }}>
            <button type="button" aria-label="Fewer" onClick={() => setTravelers((n) => Math.max(1, n - 1))} style={stepBtn}>
              <Minus size={16} />
            </button>
            <span className="site-serif" style={{ fontSize: 22, color: "var(--head)" }}>{travelers}</span>
            <button type="button" aria-label="More" onClick={() => setTravelers((n) => Math.min(30, n + 1))} style={stepBtn}>
              <Plus size={16} />
            </button>
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12.5, color: "var(--txt-mid)", marginBottom: 6 }}>
            Total price {selected ? <span style={{ color: "var(--txt-faint)" }}>({fmt(unit)} × {travelers})</span> : ""}
          </label>
          <div style={{ display: "flex", alignItems: "center", minHeight: 44, background: "rgba(2,136,209,.1)", border: "1px solid rgba(2,136,209,.4)", borderRadius: 8, padding: "8px 16px" }}>
            <span className="site-serif" style={{ fontSize: 24, color: "var(--gold)" }}>
              {selected ? fmt(total) : "Select a package"}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))" }}>
        <div>
          <label style={{ display: "block", fontSize: 12.5, color: "var(--txt-mid)", marginBottom: 6 }}>Arrival date</label>
          <input className="site-input" type="date" value={form.arrivalDate} onChange={(e) => set("arrivalDate", e.target.value)} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12.5, color: "var(--txt-mid)", marginBottom: 6 }}>Return date</label>
          <input className="site-input" type="date" value={form.returnDate} onChange={(e) => set("returnDate", e.target.value)} />
        </div>
      </div>
      <textarea className="site-input" placeholder="Anything else we should know?" rows={4} value={form.message} onChange={(e) => set("message", e.target.value)} />
      {status === "error" && <p style={{ color: "#ff8a8a", fontSize: 14, margin: 0 }}>{error}</p>}
      <button type="submit" className="btn-primary" disabled={status === "sending"} style={{ width: "max-content" }}>
        {status === "sending" ? "Submitting…" : "Request booking"}
      </button>
    </form>
  );
}

const stepBtn: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 8,
  border: "1px solid var(--bd)",
  display: "grid",
  placeItems: "center",
  color: "var(--head)",
  background: "transparent",
  cursor: "pointer",
};
