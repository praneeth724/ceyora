import { prisma } from "@/lib/prisma";
import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { InquiriesTable } from "@/components/admin/inbox/inquiries-table";

export default async function InquiriesPage() {
  await guardPage("inquiries");
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Inquiries" description="Messages from your contact form." />
      <InquiriesTable
        rows={inquiries.map((i) => ({
          id: i.id,
          name: i.name,
          email: i.email,
          phone: i.phone,
          subject: i.subject,
          message: i.message,
          status: i.status,
          createdAt: i.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
