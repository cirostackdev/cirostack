"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RESOURCE_TYPES } from "@/lib/admin-options";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function NewResourcePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    type: "Whitepaper",
    title: "",
    description: "",
    pages: "",
    tags: "",
    downloadUrl: "",
    imageUrl: "",
    isNew: false,
    published: true,
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/cms/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      update("imageUrl", url);
      toast.success("Image uploaded");
    } else {
      toast.error("Image upload failed");
    }
    setImageUploading(false);
  }

  function update(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleTitleChange(value: string) {
    update("title", value);
    if (!slugTouched) {
      update("slug", toSlug(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const res = await fetch("/api/admin/cms/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create");
      }
      toast.success("Resource created");
      router.push("/admin/cms/resources");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="New Resource">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="AI Integration Guide" required />
          </div>
          <div className="space-y-1.5">
            <Label>Slug *</Label>
            <Input value={form.slug} onChange={(e) => { setSlugTouched(true); update("slug", e.target.value); }} placeholder="ai-integration-guide" required />
            <p className="text-xs text-muted-foreground mt-1">Auto-generated from title. Edit to customise.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Cover Image</Label>
          <div className="flex items-center gap-3">
            {form.imageUrl && <img src={form.imageUrl} alt="" className="w-20 h-14 object-cover rounded-lg" />}
            <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} />
          </div>
          {imageUploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => update("type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RESOURCE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Pages / Duration</Label>
            <Input value={form.pages} onChange={(e) => update("pages", e.target.value)} placeholder="42 pages or 60 min" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Description *</Label>
          <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Brief description of the resource" required rows={3} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Tags (comma-separated)</Label>
            <Input value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="AI, Integration, Strategy" />
          </div>
          <div className="space-y-1.5">
            <Label>Download URL</Label>
            <Input value={form.downloadUrl} onChange={(e) => update("downloadUrl", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isNew} onChange={(e) => update("isNew", e.target.checked)} />
            Featured
          </label>
        </div>

        <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Resource"}</Button>
      </form>
    </AdminShell>
  );
}
