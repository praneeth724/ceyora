/**
 * Lightweight JSON localization for the public site.
 *
 * Only the site's *static* chrome and headings are translated (nav, hero,
 * footer, section titles) — dynamic content from the database (destinations,
 * packages, categories, blog posts) stays in its authored language, matching
 * the reference site's behaviour.
 *
 * Add a language by dropping a `<code>.json` file in src/locales (same shape as
 * en.json), importing it here, and adding an entry to LOCALES.
 */
import en from "@/locales/en.json";
import de from "@/locales/de.json";
import fr from "@/locales/fr.json";

export type Dict = typeof en;
export type Locale = "en" | "de" | "fr";

export const DEFAULT_LOCALE: Locale = "en";

/** Languages shown in the navbar switcher (with country flags). */
export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const DICTS: Record<Locale, Dict> = { en, de: de as Dict, fr: fr as Dict };

export function normalizeLocale(value: string | undefined | null): Locale {
  return LOCALES.some((l) => l.code === value) ? (value as Locale) : DEFAULT_LOCALE;
}

export function getDictionary(locale: string | undefined | null): Dict {
  return DICTS[normalizeLocale(locale)];
}
