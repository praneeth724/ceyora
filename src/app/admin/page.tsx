import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { can, canManageAdmins } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderTree,
  Package,
  MapPin,
  Newspaper,
  Star,
  Mail,
  CalendarCheck,
} from "lucide-react";

export default async function AdminDashboard() {
  const user = (await getSession())!;

  const [categories, packages, destinations, blogs, pendingReviews, newInquiries, pendingBookings] =
    await Promise.all([
      prisma.category.count(),
      prisma.package.count(),
      prisma.destination.count(),
      prisma.blog.count(),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
    ]);

  const cards = [
    { key: "categories", label: "Categories", value: categories, href: "/admin/categories", icon: FolderTree },
    { key: "packages", label: "Packages", value: packages, href: "/admin/packages", icon: Package },
    { key: "destinations", label: "Destinations", value: destinations, href: "/admin/destinations", icon: MapPin },
    { key: "blogs", label: "Blog Posts", value: blogs, href: "/admin/blogs", icon: Newspaper },
    { key: "reviews", label: "Pending Reviews", value: pendingReviews, href: "/admin/reviews", icon: Star },
    { key: "inquiries", label: "New Inquiries", value: newInquiries, href: "/admin/inquiries", icon: Mail },
    { key: "bookings", label: "Pending Bookings", value: pendingBookings, href: "/admin/bookings", icon: CalendarCheck },
  ] as const;

  const visible = cards.filter((c) => can(user, c.key));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening on your site.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.key} href={c.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    {c.label}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-sky-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{c.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {canManageAdmins(user) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Super Admin</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">
            You can manage other admins and their permissions from the{" "}
            <Link href="/admin/admins" className="font-medium text-sky-600 hover:underline">
              Admins
            </Link>{" "}
            section.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
