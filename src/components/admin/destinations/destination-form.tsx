"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
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
import { GalleryUploader } from "@/components/admin/gallery-uploader";

const LocationPicker = dynamic(() => import("@/components/admin/location-picker"), {
  ssr: false,
  loading: () => <div className="h-[300px] animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />,
});

// Derive the stylised-map pin position (%) from real coordinates using
// Sri Lanka's approximate bounding box.
function toPin(lat: number, lng: number) {
  const left = Math.max(0, Math.min(100, ((lng - 79.5) / (82.0 - 79.5)) * 100));
  const top = Math.max(0, Math.min(100, ((9.9 - lat) / (9.9 - 5.8)) * 100));
  return { top: `${top.toFixed(1)}%`, left: `${left.toFixed(1)}%` };
}

export interface DestinationInitial {
  id?: number;
  name?: string;
  tag?: string | null;
  subtitle?: string | null;
  description?: string;
  shortDesc?: string | null;
  hero?: string | null;
  gallery?: string[];
  rating?: string | null;
  pinTop?: string | null;
  pinLeft?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isFeatured?: boolean;
}

export function DestinationForm({ initial }: { initial?: DestinationInitial }) {
  const router = useRouter();
  const editing = Boolean(initial?.id);

  const [name, setName] = useState(initial?.name ?? "");
  const [tag, setTag] = useState(initial?.tag ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [shortDesc, setShortDesc] = useState(initial?.shortDesc ?? "");
  const [hero, setHero] = useState(initial?.hero ?? "");
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [rating, setRating] = useState(initial?.rating ?? "");
  const [pinTop, setPinTop] = useState(initial?.pinTop ?? "");
  const [pinLeft, setPinLeft] = useState(initial?.pinLeft ?? "");
  const [lat, setLat] = useState<number | null>(initial?.latitude ?? null);
  const [lng, setLng] = useState<number | null>(initial?.longitude ?? null);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [saving, setSaving] = useState(false);

  function handleLocation(newLat: number, newLng: number, placeName?: string) {
    setLat(newLat);
    setLng(newLng);
    const pin = toPin(newLat, newLng);
    setPinTop(pin.top);
    setPinLeft(pin.left);
    if (placeName && !name) setName(placeName);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editing
        ? `/api/admin/destinations/${initial!.id}`
        : "/api/admin/destinations";
      const res = await fetch(endpoint, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          tag,
          subtitle,
          description,
          shortDesc,
          hero,
          gallery,
          rating,
          pinTop,
          pinLeft,
          latitude: lat,
          longitude: lng,
          isFeatured,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Save failed");
        return;
      }
      toast.success(editing ? "Destination updated" : "Destination created");
      router.push("/admin/destinations");
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Sigiriya" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag">Tag / Region</Label>
                <Input id="tag" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g. Cultural Triangle" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Short tagline" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDesc">Short description (cards)</Label>
              <Textarea id="shortDesc" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Full description *</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} required />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <GalleryUploader value={gallery} onChange={setGallery} folder="ceyora/destinations" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="isFeatured">Featured</Label>
              <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input id="rating" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="e.g. 4.9" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Label>Location on the map</Label>
            <LocationPicker lat={lat} lng={lng} onChange={handleLocation} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <ImageUploader label="Hero image" value={hero} onChange={setHero} folder="ceyora/destinations" />
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 lg:col-span-3">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editing ? "Save changes" : "Create destination"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
