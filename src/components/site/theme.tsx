"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

/** Wraps the whole public site, owns the `.site-root` element + theme state. */
export function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ceyora-theme") as Theme | null;
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {
      /* ignore */
    }
  }, []);

  function toggle() {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("ceyora-theme", next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div className="site-root" data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/** Sun/moon toggle used in the navbar. */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch theme"
      title="Switch theme"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: compact ? "10px 14px" : "10px 14px",
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
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
      {!compact && (theme === "dark" ? "Light" : "Dark")}
    </button>
  );
}
