"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminFormSkeleton } from "@/components/admin/AdminSkeletons";

export default function EditAnnouncementPage() {
  const { id } = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/cms/announcements")
      .then((r) => r.json())
      .then((announcements) => {
        const found = announcements.find((a: any) => a.id === id);
        if (found) setForm(found);
        setLoading(false);
      });
  }, [id]);

  function update(field: string, value: any) {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { id: _id, createdAt, updatedAt, ...data } = form;
      const res = await fetch(`/api/admin/cms/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Announcement updated");
      router.push("/admin/cms/announcements");
    } catch {
      toast.error("Failed to update announcement");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminShell title="Edit Announcement"><AdminFormSkeleton /></AdminShell>;
  if (!form) return <AdminShell title="Edit Announcement"><p>Announcement not found</p></AdminShell>;

  return (
    <AdminShell title={`Edit: ${form.title}`}>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input value={form.slug || ""} onChange={(e) => update("slug", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.type || "Press Release"}
              onChange={(e) => update("type", e.target.value)}
            >
              <option value="Press Release">Press Release</option>
              <option value="Media Coverage">Media Coverage</option>
              <option value="Award">Award</option>
              <option value="Partnership">Partnership</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input value={form.title || ""} onChange={(e) => update("title", e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label>Summary</Label>
          <Textarea value={form.summary || ""} onChange={(e) => update("summary", e.target.value)} rows={3} />
        </div>

        <div className="space-y-1.5">
          <Label>Body</Label>
          <Textarea value={form.body || ""} onChange={(e) => update("body", e.target.value)} rows={8} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={form.date ? new Date(form.date).toISOString().split("T")[0] : ""} onChange={(e) => update("date", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Source</Label>
            <Input value={form.source || ""} onChange={(e) => update("source", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Tag</Label>
            <Input value={form.tag || ""} onChange={(e) => update("tag", e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>URL</Label>
          <Input value={form.url || ""} onChange={(e) => update("url", e.target.value)} />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published ?? true} onChange={(e) => update("published", e.target.checked)} />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured ?? false} onChange={(e) => update("featured", e.target.checked)} />
            Featured
          </label>
        </div>

        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
      </form>
    </AdminShell>
  );
}
