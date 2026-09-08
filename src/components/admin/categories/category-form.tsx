"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/image-uploader";

export interface CategoryInitial {
  id?: number;
  title?: string;
  description?: string;
  coverImage?: string | null;
  cardImage?: string | null;
  isPopular?: boolean;
  sortOrder?: number;
}

export function CategoryForm({ initial }: { initial?: CategoryInitial }) {
  const router = useRouter();
  const editing = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [cardImage, setCardImage] = useState(initial?.cardImage ?? "");
  const [isPopular, setIsPopular] = useState(initial?.isPopular ?? false);
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editing ? `/api/admin/categories/${initial!.id}` : "/api/admin/categories";
      const res = await fetch(endpoint, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          coverImage,
          cardImage,
          isPopular,
          sortOrder: Number(sortOrder) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Save failed");
        return;
      }
      toast.success(editing ? "Category updated" : "Category created");
      router.push("/admin/categories");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Beach Escapes"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe this tour category…"
                required
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="isPopular">Popular category</Label>
              <Switch id="isPopular" checked={isPopular} onCheckedChange={setIsPopular} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <ImageUploader
              label="Cover image"
              value={coverImage}
              onChange={setCoverImage}
              folder="ceyora/categories"
            />
            <ImageUploader
              label="Card image"
              value={cardImage}
              onChange={setCardImage}
              folder="ceyora/categories"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 lg:col-span-3">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editing ? "Save changes" : "Create category"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
