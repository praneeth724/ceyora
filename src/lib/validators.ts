import { z } from "zod";

const optionalUrl = z.string().trim().max(500).nullish().or(z.literal(""));
const optionalStr = (max: number) => z.string().trim().max(max).nullish().or(z.literal(""));

// ---- Categories ----------------------------------------------------------

export const categorySchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(1),
  coverImage: optionalUrl,
  cardImage: optionalUrl,
  isPopular: z.boolean().optional().default(false),
  sortOrder: z.coerce.number().int().optional().default(0),
});

// ---- Destinations --------------------------------------------------------

export const destinationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  tag: z.string().trim().max(120).optional().or(z.literal("")),
  subtitle: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().min(1),
  shortDesc: z.string().trim().optional().or(z.literal("")),
  hero: optionalUrl,
  gallery: z.array(z.string()).optional().default([]),
  rating: z.string().trim().max(10).optional().or(z.literal("")),
  pinTop: z.string().trim().max(10).optional().or(z.literal("")),
  pinLeft: z.string().trim().max(10).optional().or(z.literal("")),
  isFeatured: z.boolean().optional().default(false),
});

// ---- Packages ------------------------------------------------------------

const journeyStep = z.object({
  day: z.coerce.number().int().optional(),
  title: z.string().trim().default(""),
  description: z.string().trim().default(""),
});
const routeStep = z.object({
  from: z.string().trim().default(""),
  to: z.string().trim().default(""),
  note: z.string().trim().optional().default(""),
});
const faqItem = z.object({
  q: z.string().trim().default(""),
  a: z.string().trim().default(""),
});

export const packageSchema = z.object({
  title: z.string().trim().min(2).max(160),
  summary: z.string().trim().optional().or(z.literal("")),
  badge: z.string().trim().max(60).optional().or(z.literal("")),
  days: z.coerce.number().int().min(1).max(365).default(1),
  nights: z.coerce.number().int().min(0).max(365).default(0),
  price: z.coerce.number().min(0).default(0),
  dealPercent: z.coerce.number().int().min(0).max(100).nullable().optional(),
  dealPrice: z.coerce.number().min(0).nullable().optional(),
  isFeatured: z.boolean().optional().default(false),
  heroImage: optionalUrl,
  overview: z.string().trim().optional().or(z.literal("")),
  gallery: z.array(z.string()).optional().default([]),
  journey: z.array(journeyStep).optional().default([]),
  route: z.array(routeStep).optional().default([]),
  included: z.array(z.string()).optional().default([]),
  excluded: z.array(z.string()).optional().default([]),
  faq: z.array(faqItem).optional().default([]),
  categoryId: z.coerce.number().int().nullable().optional(),
  destinationIds: z.array(z.coerce.number().int()).optional().default([]),
});

// ---- Blogs ---------------------------------------------------------------

export const blogSchema = z.object({
  title: z.string().trim().min(2).max(200),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  excerpt: z.string().trim().optional().or(z.literal("")),
  content: z.string().trim().min(1),
  coverImage: optionalUrl,
  author: z.string().trim().max(120).optional().or(z.literal("")),
  isPublished: z.boolean().optional().default(true),
});

// ---- Site settings -------------------------------------------------------

export const settingsSchema = z.object({
  siteName: z.string().trim().min(1).max(120),
  tagline: optionalStr(200),
  logoFull: optionalUrl,
  logoMark: optionalUrl,
  logoWord: optionalUrl,
  favicon: optionalUrl,
  heroImage: optionalUrl,
  email: optionalStr(160),
  phone: optionalStr(60),
  address: optionalStr(300),
  whatsapp: optionalStr(60),
  facebook: optionalUrl,
  instagram: optionalUrl,
  twitter: optionalUrl,
  youtube: optionalUrl,
});

// ---- Admins --------------------------------------------------------------

export const createAdminSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  password: z.string().min(6).max(100),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]).default("ADMIN"),
  access: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

export const updateAdminSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  password: z.string().min(6).max(100).optional().or(z.literal("")),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]).optional(),
  access: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// ---- Reviews -------------------------------------------------------------

export const reviewSchema = z.object({
  name: z.string().trim().min(2).max(120),
  country: optionalStr(80),
  category: optionalStr(60),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  message: z.string().trim().min(1).max(4000),
  profileImg: optionalUrl,
  photos: z.array(z.string()).optional().default([]),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional().default("APPROVED"),
});

export const publicReviewSchema = z.object({
  name: z.string().trim().min(2).max(120),
  country: optionalStr(80),
  category: optionalStr(60),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().trim().min(1).max(4000),
  profileImg: optionalUrl,
  photos: z.array(z.string()).max(6).optional().default([]),
});

// ---- Public forms --------------------------------------------------------

export const publicInquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(60).optional().or(z.literal("")),
  subject: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(4000),
});

export const publicBookingSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(60).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  travelers: z.coerce.number().int().min(1).max(100).nullable().optional(),
  arrivalDate: z.string().trim().max(40).optional().or(z.literal("")),
  returnDate: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  packageId: z.coerce.number().int().nullable().optional(),
  packageName: z.string().trim().max(200).optional().or(z.literal("")),
});
