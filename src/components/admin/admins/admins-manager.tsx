"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { PERMISSIONS } from "@/lib/permissions";

export interface AdminRow {
  id: number;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  access: string[];
  isActive: boolean;
}

export function AdminsManager({
  admins,
  currentUserId,
}: {
  admins: AdminRow[];
  currentUserId: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminRow | null>(null);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SUPER_ADMIN">("ADMIN");
  const [access, setAccess] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("ADMIN");
    setAccess([]);
    setIsActive(true);
    setOpen(true);
  }

  function openEdit(a: AdminRow) {
    setEditing(a);
    setName(a.name);
    setEmail(a.email);
    setPassword("");
    setRole(a.role);
    setAccess(a.access);
    setIsActive(a.isActive);
    setOpen(true);
  }

  function toggle(key: string) {
    setAccess((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  async function save() {
    setSaving(true);
    try {
      const payload = editing
        ? { name, role, access, isActive, ...(password ? { password } : {}) }
        : { name, email, password, role, access, isActive };
      const endpoint = editing ? `/api/admin/admins/${editing.id}` : "/api/admin/admins";
      const res = await fetch(endpoint, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Save failed");
        return;
      }
      toast.success(editing ? "Admin updated" : "Admin created");
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
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" /> New Admin
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <div className="font-medium">
                    {a.name}
                    {a.id === currentUserId && <span className="ml-2 text-xs text-slate-400">(you)</span>}
                  </div>
                  <div className="text-xs text-slate-500">{a.email}</div>
                </TableCell>
                <TableCell>
                  {a.role === "SUPER_ADMIN" ? (
                    <Badge>Super Admin</Badge>
                  ) : (
                    <Badge variant="secondary">Admin</Badge>
                  )}
                </TableCell>
                <TableCell className="max-w-[260px]">
                  {a.role === "SUPER_ADMIN" ? (
                    <span className="text-slate-500">All access</span>
                  ) : a.access.length ? (
                    <span className="text-xs text-slate-600">{a.access.join(", ")}</span>
                  ) : (
                    <span className="text-slate-400">None</span>
                  )}
                </TableCell>
                <TableCell>
                  {a.isActive ? (
                    <Badge variant="secondary">Active</Badge>
                  ) : (
                    <Badge variant="outline">Disabled</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(a)} aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {a.id !== currentUserId && (
                      <DeleteButton endpoint={`/api/admin/admins/${a.id}`} label="admin" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Admin" : "New Admin"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="a-name">Name</Label>
              <Input id="a-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="a-email">Email</Label>
              <Input
                id="a-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={Boolean(editing)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="a-pass">
                {editing ? "New password (leave blank to keep)" : "Password"}
              </Label>
              <Input
                id="a-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={editing ? "••••••••" : "min 6 characters"}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as "ADMIN" | "SUPER_ADMIN")}
                disabled={editing?.id === currentUserId}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "ADMIN" && (
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 rounded-lg border p-3">
                  {PERMISSIONS.map((p) => (
                    <label key={p.key} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={access.includes(p.key)} onCheckedChange={() => toggle(p.key)} />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="a-active">Active</Label>
              <Switch
                id="a-active"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={editing?.id === currentUserId}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
