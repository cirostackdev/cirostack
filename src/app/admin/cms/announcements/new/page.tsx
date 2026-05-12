"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    type: "Press Release",
    title: "",
    summary: "",
    body: "",
    date: "",
    source: "",
    tag: "",
    url: "",
    featured: false,
    published: true,
  });

  function update(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create");
      }
      toast.success("Announcement created");
      router.push("/admin/cms/announcements");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="New Announcement">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Slug *</Label>
            <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="company-raises-series-a" required />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.type}
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
          <Label>Title *</Label>
          <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Announcement title" required />
        </div>

        <div className="space-y-1.5">
          <Label>Summary *</Label>
          <Textarea value={form.summary} onChange={(e) => update("summary", e.target.value)} placeholder="Brief summary for the newsroom listing" required rows={3} />
        </div>

        <div className="space-y-1.5">
          <Label>Body</Label>
          <Textarea value={form.body} onChange={(e) => update("body", e.target.value)} placeholder="Full article content (optional)" rows={8} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Date *</Label>
            <Input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Source</Label>
            <Input value={form.source} onChange={(e) => update("source", e.target.value)} placeholder="TechCrunch" />
          </div>
          <div className="space-y-1.5">
            <Label>Tag</Label>
            <Input value={form.tag} onChange={(e) => update("tag", e.target.value)} placeholder="Funding" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>URL</Label>
          <Input value={form.url} onChange={(e) => update("url", e.target.value)} placeholder="https://example.com/article" />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
            Featured
          </label>
        </div>

        <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Announcement"}</Button>
      </form>
    </AdminShell>
  );
}
