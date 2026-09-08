"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadCloud, Loader2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface GalleryItem {
  id: number;
  title: string | null;
  image: string;
}

export function GalleryManager({ images }: { images: GalleryItem[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState(images);

  async function handleFiles(files: FileList) {
    setUploading(true);
    let added = 0;
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "ceyora/gallery");
        const up = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const upData = await up.json();
        if (!up.ok) { toast.error(upData.error || "Upload failed"); continue; }
        const save = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: upData.url, title: file.name.replace(/\.[^.]+$/, "") }),
        });
        if (save.ok) { const created = await save.json(); setData((p) => [created, ...p]); added++; }
      }
      if (added) toast.success(`Added ${added} image(s)`);
      router.refresh();
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: number) {
    const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    if (res.ok) { setData((p) => p.filter((x) => x.id !== id)); toast.success("Deleted"); router.refresh(); }
    else toast.error("Delete failed");
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }} />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="mb-6 flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm text-slate-500 transition-colors hover:border-sky-500 hover:text-sky-600"
      >
        {uploading ? <Loader2 className="h-7 w-7 animate-spin" /> : <UploadCloud className="h-7 w-7" />}
        {uploading ? "Uploading…" : "Click to upload gallery images"}
      </button>

      {data.length === 0 ? (
        <p className="text-center text-slate-500">No gallery images yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((g) => (
            <Card key={g.id} className="group relative overflow-hidden p-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.image} alt={g.title ?? ""} className="h-40 w-full object-cover" />
              <button
                onClick={() => remove(g.id)}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
