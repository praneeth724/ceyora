import { prisma } from "@/lib/prisma";
import { guardSuperAdmin } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { AdminsManager } from "@/components/admin/admins/admins-manager";

export default async function AdminsPage() {
  const me = await guardSuperAdmin();
  const admins = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, access: true, isActive: true },
  });

  return (
    <div>
      <PageHeader title="Admins" description="Manage admins and their permissions." />
      <AdminsManager
        currentUserId={me.id}
        admins={admins.map((a) => ({
          id: a.id,
          name: a.name,
          email: a.email,
          role: a.role,
          access: Array.isArray(a.access) ? (a.access as string[]) : [],
          isActive: a.isActive,
        }))}
      />
    </div>
  );
}
