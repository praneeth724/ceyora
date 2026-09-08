"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Star, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { cn } from "@/lib/utils";

export interface ReviewRow {
  id: number;
  name: string;
  country: string | null;
  category: string | null;
  rating: number;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

const STATUS = ["PENDING", "APPROVED", "REJECTED"] as const;

function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={onChange ? () => onChange(n) : undefined}
          className={cn(onChange ? "cursor-pointer" : "cursor-default")}
          aria-label={`${n} star`}
        >
          <Star className={cn("h-4 w-4", n <= value ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
        </button>
      ))}
    </div>
  );
}

function statusVariant(s: string): "default" | "secondary" | "outline" | "destructive" {
  if (s === "APPROVED") return "default";
  if (s === "REJECTED") return "destructive";
  return "outline";
}

export function ReviewsManager({ reviews }: { reviews: ReviewRow[] }) {
  const router = useRouter();
  const [data, setData] = useState(reviews);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [copied, setCopied] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ReviewRow | null>(null);
  const [form, setForm] = useState({ name: "", country: "", category: "", rating: 5, message: "", status: "APPROVED" as ReviewRow["status"] });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return data.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (!q) return true;
      const hay = `${r.name} ${r.country ?? ""} ${r.category ?? ""} ${r.message}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [data, q, statusFilter]);

  const reviewLink = typeof window !== "undefined" ? `${window.location.origin}/leave-a-review` : "/leave-a-review";

  function copyLink() {
    navigator.clipboard?.writeText(reviewLink).then(() => {
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", country: "", category: "", rating: 5, message: "", status: "APPROVED" });
    setOpen(true);
  }
  function openEdit(r: ReviewRow) {
    setEditing(r);
    setForm({ name: r.name, country: r.country ?? "", category: r.category ?? "", rating: r.rating, message: r.message, status: r.status });
    setOpen(true);
  }

  async function updateStatus(id: number, status: ReviewRow["status"]) {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (!res.ok) toast.error("Could not update status");
    else toast.success("Status updated");
  }

  async function save() {
    setSaving(true);
    try {
      const endpoint = editing ? `/api/admin/reviews/${editing.id}` : "/api/admin/reviews";
      const res = await fetch(endpoint, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) { toast.error(d.error || "Save failed"); return; }
      toast.success(editing ? "Review updated" : "Review added");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Share link banner */}
      <Card className="mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-950">
            <Link2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm">Send this link to guests after their tour so they can leave a review</p>
            <code className="text-xs text-slate-500">{reviewLink}</code>
          </div>
        </div>
        <Button variant="outline" onClick={copyLink} className="shrink-0">
          {copied ? <Check className="mr-1 h-4 w-4" /> : <Link2 className="mr-1 h-4 w-4" />}
          Copy Link
        </Button>
      </Card>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input placeholder="Search by name, country, category…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "ALL")}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button className="ml-auto" onClick={openCreate}><Plus className="mr-1 h-4 w-4" /> Add Review</Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reviewer</TableHead>
              <TableHead>Stars</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="py-10 text-center text-slate-500">No reviews found.</TableCell></TableRow>
            )}
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell><Stars value={r.rating} /></TableCell>
                <TableCell>{r.country || <span className="text-slate-400">—</span>}</TableCell>
                <TableCell>{r.category ? <Badge variant="secondary">{r.category}</Badge> : <span className="text-slate-400">—</span>}</TableCell>
                <TableCell className="max-w-[280px] truncate text-sm text-slate-600">{r.message}</TableCell>
                <TableCell>
                  <Select value={r.status} onValueChange={(v) => v && updateStatus(r.id, v as ReviewRow["status"])}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                    <DeleteButton endpoint={`/api/admin/reviews/${r.id}`} label="review" onDeleted={() => setData((p) => p.filter((x) => x.id !== r.id))} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <p className="mt-3 text-sm text-slate-500">Showing {filtered.length} of {data.length} reviews</p>

      {/* Add/edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Review" : "Add Review"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Reviewer name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Category / traveller type</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Solo, Couple, Family…" /></div>
              <div className="space-y-2"><Label>Rating</Label><div className="pt-2"><Stars value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} /></div></div>
            </div>
            <div className="space-y-2"><Label>Review</Label><Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => v && setForm({ ...form, status: v as ReviewRow["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
