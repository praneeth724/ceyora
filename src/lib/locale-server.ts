/**
 * Server-only helpers to resolve the active locale from the `lang` cookie.
 * Kept separate from i18n.ts (which is import-safe in client components) because
 * this imports next/headers.
 */
import { cookies } from "next/headers";
import { getDictionary, normalizeLocale, type Dict, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return normalizeLocale(store.get("lang")?.value);
}

export async function getDict(): Promise<{ locale: Locale; dict: Dict }> {
  const locale = await getLocale();
  return { locale, dict: getDictionary(locale) };
}
