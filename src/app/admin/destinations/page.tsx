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

export default async function DestinationsPage() {
  await guardPage("destinations");
  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { packages: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Destinations"
        description="Places travellers can explore across the island."
        actionHref="/admin/destinations/new"
        actionLabel="New Destination"
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Packages</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {destinations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                  No destinations yet.
                </TableCell>
              </TableRow>
            )}
            {destinations.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell>{d.tag || <span className="text-slate-400">—</span>}</TableCell>
                <TableCell>{d._count.packages}</TableCell>
                <TableCell>
                  {d.isFeatured ? <Badge>Featured</Badge> : <span className="text-slate-400">—</span>}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      nativeButton={false}
                      render={<Link href={`/admin/destinations/${d.id}/edit`} aria-label="Edit" />}
                      variant="ghost"
                      size="icon"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DeleteButton endpoint={`/api/admin/destinations/${d.id}`} label="destination" />
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
