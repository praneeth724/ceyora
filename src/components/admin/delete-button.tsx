"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteButton({
  endpoint,
  label = "item",
  onDeleted,
  redirectTo,
  variant = "icon",
}: {
  endpoint: string;
  label?: string;
  onDeleted?: () => void;
  redirectTo?: string;
  variant?: "icon" | "button";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function confirm() {
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Delete failed");
        return;
      }
      toast.success(`Deleted ${label}`);
      setOpen(false);
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
      onDeleted?.();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => setOpen(true)}
          aria-label={`Delete ${label}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="destructive" onClick={() => setOpen(true)}>
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {label}?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The {label} will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirm} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
