"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RESOURCE_TYPES } from "@/lib/admin-options";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminFormSkeleton } from "@/components/admin/AdminSkeletons";

export default function EditResourcePage() {
  const { id } = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [form, setForm] = useState<any>(null);

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

  useEffect(() => {
    fetch("/api/admin/cms/resources")
      .then((r) => r.json())
      .then((resources) => {
        const found = resources.find((r: any) => r.id === id);
        if (found) {
          setForm({
            ...found,
            tags: Array.isArray(found.tags) ? found.tags.join(", ") : "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  function update(field: string, value: any) {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { id: _id, createdAt, updatedAt, ...data } = form;
      const payload = {
        ...data,
        tags: typeof data.tags === "string"
          ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : data.tags,
      };
      const res = await fetch(`/api/admin/cms/resources/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Resource updated");
      router.push("/admin/cms/resources");
    } catch {
      toast.error("Failed to update resource");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminShell title="Edit Resource"><AdminFormSkeleton /></AdminShell>;
  if (!form) return <AdminShell title="Edit Resource"><p>Resource not found</p></AdminShell>;

  return (
    <AdminShell title={`Edit: ${form.title}`}>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input value={form.slug || ""} onChange={(e) => update("slug", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.title || ""} onChange={(e) => update("title", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type || "Whitepaper"} onValueChange={(v) => update("type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RESOURCE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Pages / Duration</Label>
            <Input value={form.pages || ""} onChange={(e) => update("pages", e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea value={form.description || ""} onChange={(e) => update("description", e.target.value)} rows={3} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Tags (comma-separated)</Label>
            <Input value={form.tags || ""} onChange={(e) => update("tags", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Download URL</Label>
            <Input value={form.downloadUrl || ""} onChange={(e) => update("downloadUrl", e.target.value)} />
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

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published ?? true} onChange={(e) => update("published", e.target.checked)} />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isNew ?? false} onChange={(e) => update("isNew", e.target.checked)} />
            Mark as New
          </label>
        </div>

        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
      </form>
    </AdminShell>
  );
}
