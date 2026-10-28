"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { LOCALES, type Locale } from "@/lib/i18n";

/**
 * Navbar language selector. Writes the chosen locale to the `lang` cookie and
 * refreshes so the server re-renders the static text in that language. Shows
 * the current country flag; expands to a flag + name list.
 */
export function LangSwitcher({ locale, block = false }: { locale: Locale; block?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function choose(code: Locale) {
    document.cookie = `lang=${code};path=/;max-age=31536000;samesite=lax`;
    setOpen(false);
    if (code !== locale) router.refresh();
  }

  return (
    <div ref={ref} style={{ position: "relative", width: block ? "100%" : undefined }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: block ? "center" : undefined,
          gap: 8,
          width: block ? "100%" : undefined,
          padding: "10px 14px",
          border: "1px solid var(--bd)",
          borderRadius: 4,
          background: "transparent",
          color: "var(--txt-mid)",
          fontSize: 11,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 15, lineHeight: 1 }}>{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <ChevronDown size={13} style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: block ? "auto" : 0,
            left: block ? 0 : "auto",
            minWidth: 168,
            width: block ? "100%" : undefined,
            background: "var(--panel-2)",
            border: "1px solid var(--bd-soft)",
            borderRadius: 12,
            padding: 6,
            boxShadow: "0 18px 40px rgba(2,12,18,.35)",
            backdropFilter: "blur(20px)",
            zIndex: 80,
          }}
        >
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={l.code === locale}
              onClick={() => choose(l.code)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "10px 12px",
                border: "none",
                borderRadius: 8,
                background: l.code === locale ? "rgba(2,136,209,.14)" : "transparent",
                color: l.code === locale ? "var(--gold-l)" : "var(--txt)",
                fontSize: 13.5,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 17, lineHeight: 1 }}>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
