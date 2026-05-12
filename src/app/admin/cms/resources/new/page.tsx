"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";

export default function NewResourcePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    type: "Whitepaper",
    title: "",
    description: "",
    pages: "",
    tags: "",
    downloadUrl: "",
    isNew: false,
    published: true,
  });

  function update(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Slug *</Label>
            <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="ai-integration-guide" required />
          </div>
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="AI Integration Guide" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
            >
              <option value="Whitepaper">Whitepaper</option>
              <option value="Guide">Guide</option>
              <option value="Template">Template</option>
              <option value="Webinar">Webinar</option>
            </select>
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

        <div className="grid grid-cols-2 gap-4">
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
            Mark as New
          </label>
        </div>

        <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Resource"}</Button>
      </form>
    </AdminShell>
  );
}
