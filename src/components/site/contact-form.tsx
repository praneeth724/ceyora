"use client";

import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function set(k: string, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/public/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setStatus("error");
        return;
      }
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div style={{ padding: 32, borderRadius: 16, border: "1px solid var(--bd-soft)", background: "var(--panel)", textAlign: "center" }}>
        <p className="site-serif" style={{ fontSize: 24, color: "var(--head)", margin: 0 }}>Thank you!</p>
        <p style={{ color: "var(--txt-mid)", marginTop: 8 }}>We&apos;ve received your message and will get back to you shortly.</p>
        <button className="btn-ghost" style={{ marginTop: 18 }} onClick={() => setStatus("idle")}>Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))" }}>
        <input className="site-input" placeholder="Your name *" required value={form.name} onChange={(e) => set("name", e.target.value)} />
        <input className="site-input" type="email" placeholder="Email *" required value={form.email} onChange={(e) => set("email", e.target.value)} />
      </div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))" }}>
        <input className="site-input" placeholder="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <input className="site-input" placeholder="Subject" value={form.subject} onChange={(e) => set("subject", e.target.value)} />
      </div>
      <textarea className="site-input" placeholder="Your message *" required rows={6} value={form.message} onChange={(e) => set("message", e.target.value)} />
      {status === "error" && <p style={{ color: "#ff8a8a", fontSize: 14, margin: 0 }}>{error}</p>}
      <button type="submit" className="btn-primary" disabled={status === "sending"} style={{ width: "max-content" }}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
