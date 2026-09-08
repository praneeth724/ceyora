# Ceyora Travels — Full-stack Tourism Platform

A full-stack Sri Lanka tourism website built with **Next.js 16 (App Router)**, **Prisma + MySQL**,
**Tailwind + shadcn/ui**, and **Cloudinary** for image uploads. It has a dynamic public site and a
secured admin panel with role-based permissions and a super-admin.

## Features

**Admin panel** (`/admin`, sign in at `/login`)
- Categories, Packages, Destinations, Blogs — full create / edit / delete with image uploads
- Packages link to a Category and to many Destinations (many-to-many)
- Inbox for public **Inquiries** and **Bookings** (view + status + delete)
- **Site Settings** — change site name, logo(s), favicon, hero image, contact info & socials
- **Admins** (super-admin only) — create admins and grant per-section permissions
- Role model: `SUPER_ADMIN` (full access + manages admins) and `ADMIN` (limited by an access list)

**Public site** (`/`)
- Home, Categories, Category detail, Packages, Package detail, Destinations, Destination detail,
  Blog, Blog post, About, Contact, Book — all driven by the database
- Site name / logo pulled live from Site Settings
- Contact & Booking forms post to the admin inbox

**Security**
- JWT session in an httpOnly cookie (`jose`), passwords hashed with `bcryptjs`
- Edge `proxy.ts` guards `/admin` and `/api/admin`
- Per-page guards + per-endpoint permission checks (`requirePermission`, `requireSuperAdmin`)

## Setup

### 1. Requirements
- Node.js 18.18+ (built on Node 24)
- A MySQL server (MAMP / XAMPP / standalone). Create a database, e.g. `ceyora`.

### 2. Environment
Copy `.env.example` to `.env` and fill it in:

```
DATABASE_URL="mysql://root:root@localhost:3306/ceyora"
JWT_SECRET="a-long-random-secret"
# Cloudinary (Dashboard → Settings → API Keys)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
```

> Image uploads need the three `CLOUDINARY_*` values. Without them the app runs, but uploading an
> image returns a clear "Cloudinary is not configured" message.

### 3. Install & initialise

```bash
npm install
npm run db:migrate      # create tables
npm run db:seed         # create the super admin + sample data
npm run dev             # http://localhost:3000
```

Default super admin (change the password after first login):
- **Email:** `admin@ceyora.com`
- **Password:** `Admin@123`

## Scripts
- `npm run dev` — start the dev server
- `npm run build` / `npm run start` — production build & serve
- `npm run db:migrate` — apply Prisma migrations
- `npm run db:seed` — seed super admin, site settings and sample data
- `npm run db:studio` — open Prisma Studio to inspect data

## Data model (relationships)
- **Category** 1 — many **Package**
- **Package** many — many **Destination**
- **Blog**, **Inquiry**, **Booking**, **SiteSetting**, **User** are standalone
  (`Booking` optionally references a `Package`)

## Project layout
```
prisma/schema.prisma            # database schema
src/lib/                        # prisma, auth, session, cloudinary, permissions, validators
src/proxy.ts                    # edge middleware (route protection)
src/app/(site)/                 # public website
src/app/admin/                  # admin dashboard (guarded)
src/app/api/auth/               # login / logout / me
src/app/api/admin/              # protected CRUD + upload endpoints
src/app/api/public/             # public inquiry & booking submissions
src/components/site/            # public UI
src/components/admin/           # admin UI
deploy/                         # original static design reference
```

The public site's look (deep-ocean palette, Playfair Display + Poppins) is derived from the
static design in `deploy/`.
