"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export interface InquiryRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["NEW", "READ", "RESPONDED", "CLOSED"];

function statusVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "NEW") return "default";
  if (status === "CLOSED") return "outline";
  return "secondary";
}

export function InquiriesTable({ rows }: { rows: InquiryRow[] }) {
  const [data, setData] = useState(rows);

  async function updateStatus(id: number, status: string) {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) toast.error("Could not update status");
    else toast.success("Status updated");
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                No inquiries yet.
              </TableCell>
            </TableRow>
          )}
          {data.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-slate-500">{r.email}</div>
              </TableCell>
              <TableCell className="max-w-[220px] truncate">
                {r.subject || <span className="text-slate-400">—</span>}
              </TableCell>
              <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Dialog>
                    <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="View" />}>
                      <Eye className="h-4 w-4" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Inquiry from {r.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 text-sm">
                        <p><span className="text-slate-500">Email:</span> {r.email}</p>
                        {r.phone && <p><span className="text-slate-500">Phone:</span> {r.phone}</p>}
                        {r.subject && <p><span className="text-slate-500">Subject:</span> {r.subject}</p>}
                        <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-900">{r.message}</div>
                        <div className="space-y-1">
                          <p className="text-slate-500">Status</p>
                          <Select value={r.status} onValueChange={(v) => v && updateStatus(r.id, v)}>
                            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Select value={r.status} onValueChange={(v) => v && updateStatus(r.id, v)}>
                    <SelectTrigger className="hidden w-32 md:flex"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <DeleteButton
                    endpoint={`/api/admin/inquiries/${r.id}`}
                    label="inquiry"
                    onDeleted={() => setData((prev) => prev.filter((x) => x.id !== r.id))}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
