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

export default async function BlogsPage() {
  await guardPage("blogs");
  const blogs = await prisma.blog.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Blogs"
        description="Stories & travel notes for your journal."
        actionHref="/admin/blogs/new"
        actionLabel="New Post"
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                  No posts yet.
                </TableCell>
              </TableRow>
            )}
            {blogs.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.title}</TableCell>
                <TableCell>{b.category || <span className="text-slate-400">—</span>}</TableCell>
                <TableCell>
                  {b.isPublished ? (
                    <Badge>Published</Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(b.publishedAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      nativeButton={false}
                      render={<Link href={`/admin/blogs/${b.id}/edit`} aria-label="Edit" />}
                      variant="ghost"
                      size="icon"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DeleteButton endpoint={`/api/admin/blogs/${b.id}`} label="post" />
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
