import { cache } from "react";
import { prisma } from "./prisma";

export interface SiteSettings {
  siteName: string;
  tagline: string | null;
  logoFull: string | null;
  logoMark: string | null;
  logoWord: string | null;
  favicon: string | null;
  heroImage: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
}

const DEFAULTS: SiteSettings = {
  siteName: "CEYORA TRAVELS",
  tagline: "Discover Sri Lanka",
  logoFull: null,
  logoMark: null,
  logoWord: null,
  favicon: null,
  heroImage: null,
  email: null,
  phone: null,
  address: null,
  whatsapp: null,
  facebook: null,
  instagram: null,
  twitter: null,
  youtube: null,
};

/** Fetch the site settings singleton, cached per request. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const s = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    if (!s) return DEFAULTS;
    return { ...DEFAULTS, ...s };
  } catch {
    return DEFAULTS;
  }
});

export function formatPrice(value: number): string {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
