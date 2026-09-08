"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

export function GalleryUploader({
  label = "Gallery",
  value,
  onChange,
  folder = "ceyora/gallery",
}: {
  label?: string;
  value: string[];
  onChange: (next: string[]) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList) {
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Upload failed");
          continue;
        }
        uploaded.push(data.url);
      }
      if (uploaded.length) {
        onChange([...value, ...uploaded]);
        toast.success(`Added ${uploaded.length} image(s)`);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((url, i) => (
          <div key={i} className="group relative overflow-hidden rounded-md border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-20 w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-20 flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs text-slate-500 hover:border-sky-500 hover:text-sky-600"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
          Add
        </button>
      </div>
    </div>
  );
}
