"use client";

import { createContext, useContext } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Wraps the whole public site and owns the `.site-root` element.
 * Theme switching is disabled for now — the site is light-only. To re-enable
 * dark mode, restore the useState/localStorage logic below and un-comment the
 * <ThemeToggle /> usages in the navbar.
 */
export function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  const theme: Theme = "light";
  return (
    <ThemeContext.Provider value={{ theme, toggle: () => {} }}>
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
