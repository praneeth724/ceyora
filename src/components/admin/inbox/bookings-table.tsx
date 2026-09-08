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

export interface BookingRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  travelers: number | null;
  arrivalDate: string | null;
  returnDate: string | null;
  message: string | null;
  packageName: string | null;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

function statusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  if (status === "CONFIRMED") return "default";
  if (status === "CANCELLED") return "destructive";
  if (status === "COMPLETED") return "secondary";
  return "outline";
}

export function BookingsTable({ rows }: { rows: BookingRow[] }) {
  const [data, setData] = useState(rows);

  async function updateStatus(id: number, status: string) {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const res = await fetch(`/api/admin/bookings/${id}`, {
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
            <TableHead>Package</TableHead>
            <TableHead>Travellers</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-slate-500">
                No bookings yet.
              </TableCell>
            </TableRow>
          )}
          {data.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-slate-500">{r.email}</div>
              </TableCell>
              <TableCell className="max-w-[180px] truncate">
                {r.packageName || <span className="text-slate-400">—</span>}
              </TableCell>
              <TableCell>{r.travelers ?? "—"}</TableCell>
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
                        <DialogTitle>Booking from {r.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-500">Email:</span> {r.email}</p>
                        {r.phone && <p><span className="text-slate-500">Phone:</span> {r.phone}</p>}
                        {r.country && <p><span className="text-slate-500">Country:</span> {r.country}</p>}
                        {r.packageName && <p><span className="text-slate-500">Package:</span> {r.packageName}</p>}
                        <p><span className="text-slate-500">Travellers:</span> {r.travelers ?? "—"}</p>
                        <p><span className="text-slate-500">Dates:</span> {r.arrivalDate || "?"} → {r.returnDate || "?"}</p>
                        {r.message && (
                          <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-900">{r.message}</div>
                        )}
                        <div className="space-y-1 pt-2">
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
                    endpoint={`/api/admin/bookings/${r.id}`}
                    label="booking"
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
