"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import { GalleryUploader } from "@/components/admin/gallery-uploader";
import { StringListEditor } from "@/components/admin/string-list-editor";

interface JourneyStep { day?: number; title: string; description: string }
interface RouteStep { from: string; to: string; note?: string }
interface FaqItem { q: string; a: string }

export interface PackageInitial {
  id?: number;
  title?: string;
  summary?: string | null;
  badge?: string | null;
  days?: number;
  nights?: number;
  price?: number;
  dealPercent?: number | null;
  dealPrice?: number | null;
  isFeatured?: boolean;
  heroImage?: string | null;
  overview?: string | null;
  gallery?: string[];
  journey?: JourneyStep[];
  route?: RouteStep[];
  included?: string[];
  excluded?: string[];
  faq?: FaqItem[];
  categoryId?: number | null;
  destinationIds?: number[];
}

export function PackageForm({
  initial,
  categories,
  destinations,
}: {
  initial?: PackageInitial;
  categories: { id: number; title: string }[];
  destinations: { id: number; name: string }[];
}) {
  const router = useRouter();
  const editing = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [badge, setBadge] = useState(initial?.badge ?? "");
  const [days, setDays] = useState(String(initial?.days ?? 1));
  const [nights, setNights] = useState(String(initial?.nights ?? 0));
  const [price, setPrice] = useState(String(initial?.price ?? 0));
  const [dealPercent, setDealPercent] = useState(
    initial?.dealPercent != null ? String(initial.dealPercent) : "",
  );
  const [dealPrice, setDealPrice] = useState(
    initial?.dealPrice != null ? String(initial.dealPrice) : "",
  );
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [heroImage, setHeroImage] = useState(initial?.heroImage ?? "");
  const [overview, setOverview] = useState(initial?.overview ?? "");
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [journey, setJourney] = useState<JourneyStep[]>(initial?.journey ?? []);
  const [route, setRoute] = useState<RouteStep[]>(initial?.route ?? []);
  const [included, setIncluded] = useState<string[]>(initial?.included ?? []);
  const [excluded, setExcluded] = useState<string[]>(initial?.excluded ?? []);
  const [faq, setFaq] = useState<FaqItem[]>(initial?.faq ?? []);
  const [categoryId, setCategoryId] = useState<string>(
    initial?.categoryId != null ? String(initial.categoryId) : "none",
  );
  const [destinationIds, setDestinationIds] = useState<number[]>(initial?.destinationIds ?? []);
  const [saving, setSaving] = useState(false);

  function toggleDestination(id: number) {
    setDestinationIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editing ? `/api/admin/packages/${initial!.id}` : "/api/admin/packages";
      const res = await fetch(endpoint, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          badge,
          days: Number(days) || 1,
          nights: Number(nights) || 0,
          price: Number(price) || 0,
          dealPercent: dealPercent === "" ? null : Number(dealPercent),
          dealPrice: dealPrice === "" ? null : Number(dealPrice),
          isFeatured,
          heroImage,
          overview,
          gallery,
          journey: journey.filter((j) => j.title || j.description),
          route: route.filter((r) => r.from || r.to),
          included: included.filter(Boolean),
          excluded: excluded.filter(Boolean),
          faq: faq.filter((f) => f.q || f.a),
          categoryId: categoryId === "none" ? null : Number(categoryId),
          destinationIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Save failed");
        return;
      }
      toast.success(editing ? "Package updated" : "Package created");
      router.push("/admin/packages");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
      {/* Main column */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Basics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Southern Coast Escape" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} placeholder="Short line shown on cards" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overview">Overview</Label>
              <Textarea id="overview" value={overview} onChange={(e) => setOverview(e.target.value)} rows={5} placeholder="Full description shown on the package page" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Day by Day</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {journey.map((step, i) => (
              <div key={i} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-20"
                    placeholder="Day"
                    value={step.day ?? ""}
                    onChange={(e) => {
                      const next = [...journey];
                      next[i] = { ...step, day: Number(e.target.value) || undefined };
                      setJourney(next);
                    }}
                  />
                  <Input
                    placeholder="Title"
                    value={step.title}
                    onChange={(e) => {
                      const next = [...journey];
                      next[i] = { ...step, title: e.target.value };
                      setJourney(next);
                    }}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setJourney(journey.filter((_, idx) => idx !== i))}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="What happens this day…"
                  rows={2}
                  value={step.description}
                  onChange={(e) => {
                    const next = [...journey];
                    next[i] = { ...step, description: e.target.value };
                    setJourney(next);
                  }}
                />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setJourney([...journey, { day: journey.length + 1, title: "", description: "" }])}>
              <Plus className="mr-1 h-4 w-4" /> Add day
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Route</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {route.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input placeholder="From" value={step.from} onChange={(e) => { const n=[...route]; n[i]={...step, from:e.target.value}; setRoute(n); }} />
                <Input placeholder="To" value={step.to} onChange={(e) => { const n=[...route]; n[i]={...step, to:e.target.value}; setRoute(n); }} />
                <Input placeholder="Note" value={step.note ?? ""} onChange={(e) => { const n=[...route]; n[i]={...step, note:e.target.value}; setRoute(n); }} />
                <Button type="button" variant="ghost" size="icon" onClick={() => setRoute(route.filter((_, idx) => idx !== i))}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setRoute([...route, { from: "", to: "", note: "" }])}>
              <Plus className="mr-1 h-4 w-4" /> Add leg
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">What&apos;s included</CardTitle></CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <StringListEditor label="Included" value={included} onChange={setIncluded} placeholder="e.g. Hotels" />
            <StringListEditor label="Excluded" value={excluded} onChange={setExcluded} placeholder="e.g. Flights" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">FAQ</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {faq.map((item, i) => (
              <div key={i} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Input placeholder="Question" value={item.q} onChange={(e) => { const n=[...faq]; n[i]={...item, q:e.target.value}; setFaq(n); }} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setFaq(faq.filter((_, idx) => idx !== i))}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea placeholder="Answer" rows={2} value={item.a} onChange={(e) => { const n=[...faq]; n[i]={...item, a:e.target.value}; setFaq(n); }} />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setFaq([...faq, { q: "", a: "" }])}>
              <Plus className="mr-1 h-4 w-4" /> Add question
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar column */}
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isFeatured">Featured</Label>
              <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "none")}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="days">Days</Label>
                <Input id="days" type="number" value={days} onChange={(e) => setDays(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nights">Nights</Label>
                <Input id="nights" type="number" value={nights} onChange={(e) => setNights(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="dealPercent">Deal %</Label>
                <Input id="dealPercent" type="number" value={dealPercent} onChange={(e) => setDealPercent(e.target.value)} placeholder="—" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dealPrice">Deal price</Label>
                <Input id="dealPrice" type="number" value={dealPrice} onChange={(e) => setDealPrice(e.target.value)} placeholder="—" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Input id="badge" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. Bestseller" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Destinations visited</CardTitle></CardHeader>
          <CardContent>
            {destinations.length === 0 ? (
              <p className="text-sm text-slate-500">No destinations yet. Add some first.</p>
            ) : (
              <div className="max-h-56 space-y-2 overflow-y-auto">
                {destinations.map((d) => (
                  <label key={d.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={destinationIds.includes(d.id)}
                      onCheckedChange={() => toggleDestination(d.id)}
                    />
                    {d.name}
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <ImageUploader label="Hero image" value={heroImage} onChange={setHeroImage} folder="ceyora/packages" />
            <GalleryUploader value={gallery} onChange={setGallery} folder="ceyora/packages" />
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 lg:col-span-3">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editing ? "Save changes" : "Create package"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
