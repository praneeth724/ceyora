import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil } from "lucide-react";

export default async function PackagesPage() {
  await guardPage("packages");
  const packages = await prisma.package.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { title: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Packages"
        description="Your tour packages and itineraries."
        actionHref="/admin/packages/new"
        actionLabel="New Package"
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-slate-500">
                  No packages yet.
                </TableCell>
              </TableRow>
            )}
            {packages.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell>{p.category?.title || <span className="text-slate-400">—</span>}</TableCell>
                <TableCell>{p.days}D / {p.nights}N</TableCell>
                <TableCell>${p.price.toLocaleString()}</TableCell>
                <TableCell>
                  {p.isFeatured ? <Badge>Featured</Badge> : <span className="text-slate-400">—</span>}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      nativeButton={false}
                      render={<Link href={`/admin/packages/${p.id}/edit`} aria-label="Edit" />}
                      variant="ghost"
                      size="icon"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DeleteButton endpoint={`/api/admin/packages/${p.id}`} label="package" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
