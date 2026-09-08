"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/image-uploader";

export interface SettingsInitial {
  siteName: string;
  tagline?: string | null;
  logoFull?: string | null;
  logoMark?: string | null;
  logoWord?: string | null;
  favicon?: string | null;
  heroImage?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  whatsapp?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  youtube?: string | null;
}

export function SettingsForm({ initial }: { initial: SettingsInitial }) {
  const router = useRouter();
  const [s, setS] = useState<SettingsInitial>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof SettingsInitial>(key: K, value: SettingsInitial[K]) {
    setS((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Save failed");
        return;
      }
      toast.success("Settings saved");
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
          <CardHeader><CardTitle className="text-base">Identity</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site name *</Label>
              <Input id="siteName" value={s.siteName} onChange={(e) => set("siteName", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" value={s.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} placeholder="e.g. Discover Sri Lanka" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={s.email ?? ""} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={s.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={s.address ?? ""} onChange={(e) => set("address", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" value={s.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Social links</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input id="facebook" value={s.facebook ?? ""} onChange={(e) => set("facebook", e.target.value)} placeholder="https://facebook.com/…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" value={s.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input id="twitter" value={s.twitter ?? ""} onChange={(e) => set("twitter", e.target.value)} placeholder="https://x.com/…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input id="youtube" value={s.youtube ?? ""} onChange={(e) => set("youtube", e.target.value)} placeholder="https://youtube.com/…" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Branding</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <ImageUploader label="Full logo" value={s.logoFull} onChange={(v) => set("logoFull", v)} folder="ceyora/brand" />
            <ImageUploader label="Logo mark (icon)" value={s.logoMark} onChange={(v) => set("logoMark", v)} folder="ceyora/brand" />
            <ImageUploader label="Wordmark" value={s.logoWord} onChange={(v) => set("logoWord", v)} folder="ceyora/brand" />
            <ImageUploader label="Favicon" value={s.favicon} onChange={(v) => set("favicon", v)} folder="ceyora/brand" />
            <ImageUploader label="Homepage hero" value={s.heroImage} onChange={(v) => set("heroImage", v)} folder="ceyora/brand" />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save settings
        </Button>
      </div>
    </form>
  );
}
