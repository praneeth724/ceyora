import { prisma } from "@/lib/prisma";
import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { BookingsTable } from "@/components/admin/inbox/bookings-table";

export default async function BookingsPage() {
  await guardPage("bookings");
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Bookings" description="Package booking requests from travellers." />
      <BookingsTable
        rows={bookings.map((b) => ({
          id: b.id,
          name: b.name,
          email: b.email,
          phone: b.phone,
          country: b.country,
          travelers: b.travelers,
          arrivalDate: b.arrivalDate,
          returnDate: b.returnDate,
          message: b.message,
          packageName: b.packageName,
          status: b.status,
          createdAt: b.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
