"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PORTFOLIO_VERTICALS, PORTFOLIO_SERVICES, PORTFOLIO_SIZES, PORTFOLIO_CATEGORIES } from "@/lib/admin-options";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminFormSkeleton } from "@/components/admin/AdminSkeletons";

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function EditPortfolioPage() {
  const { id } = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);
  const [slugTouched, setSlugTouched] = useState(true); // edit form: slug is already set

  useEffect(() => {
    fetch(`/api/admin/cms/portfolio/${id}`)
      .then((r) => r.json())
      .then((project) => {
        if (project && !project.error) {
          setForm({
            ...project,
            technologies: Array.isArray(project.technologies)
              ? project.technologies.join(", ")
              : typeof project.technologies === "string"
              ? project.technologies
              : "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function update(field: string, value: any) {
    setForm((prev: any) => ({ ...prev, [field]: value }));
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
      const { id: _id, createdAt, updatedAt, ...data } = form;
      const payload = {
        ...data,
        technologies: typeof data.technologies === "string"
          ? data.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
          : data.technologies,
      };
      const res = await fetch(`/api/admin/cms/portfolio/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Project updated");
      router.push("/admin/cms/portfolio");
    } catch {
      toast.error("Failed to update project");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminShell title="Edit Project"><AdminFormSkeleton /></AdminShell>;
  if (!form) return <AdminShell title="Edit Project"><p>Project not found</p></AdminShell>;

  return (
    <AdminShell title={`Edit: ${form.title}`}>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">

        <div className="border-t border-border pt-6"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Basic Info</p></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input value={form.title || ""} onChange={(e) => handleTitleChange(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Slug *</Label>
            <Input
              value={form.slug || ""}
              onChange={(e) => { setSlugTouched(true); update("slug", e.target.value); }}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Auto-generated from title. Edit to customise.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Client</Label>
            <Input value={form.client || ""} onChange={(e) => update("client", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Vertical</Label>
            <Select value={form.vertical || ""} onValueChange={(v) => update("vertical", v)}>
              <SelectTrigger className="py-1"><SelectValue /></SelectTrigger>
              <SelectContent>{PORTFOLIO_VERTICALS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category || ""} onValueChange={(v) => update("category", v)}>
              <SelectTrigger className="py-1"><SelectValue /></SelectTrigger>
              <SelectContent>{PORTFOLIO_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Service</Label>
            <Select value={form.service || ""} onValueChange={(v) => update("service", v)}>
              <SelectTrigger className="py-1"><SelectValue /></SelectTrigger>
              <SelectContent>{PORTFOLIO_SERVICES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Input value={form.country || ""} onChange={(e) => update("country", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input value={form.location || ""} onChange={(e) => update("location", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Size</Label>
            <Select value={form.size || ""} onValueChange={(v) => update("size", v)}>
              <SelectTrigger className="py-1"><SelectValue /></SelectTrigger>
              <SelectContent>{PORTFOLIO_SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Duration</Label>
            <Input value={form.duration || ""} onChange={(e) => update("duration", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Year</Label>
            <Input value={form.year || ""} onChange={(e) => update("year", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Image URL</Label>
            <Input value={form.imageUrl || ""} onChange={(e) => update("imageUrl", e.target.value)} />
          </div>
        </div>

        <div className="border-t border-border pt-6"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Content</p></div>

        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea value={form.description || ""} onChange={(e) => update("description", e.target.value)} rows={2} />
        </div>

        <div className="space-y-1.5">
          <Label>About Client</Label>
          <Textarea value={form.aboutClient || ""} onChange={(e) => update("aboutClient", e.target.value)} rows={3} />
        </div>

        <div className="space-y-1.5">
          <Label>Challenge</Label>
          <Textarea value={form.challenge || ""} onChange={(e) => update("challenge", e.target.value)} rows={3} />
        </div>

        <div className="space-y-1.5">
          <Label>Solution</Label>
          <Textarea value={form.solution || ""} onChange={(e) => update("solution", e.target.value)} rows={3} />
        </div>

        <div className="space-y-1.5">
          <Label>Result</Label>
          <Textarea value={form.result || ""} onChange={(e) => update("result", e.target.value)} rows={3} />
        </div>

        <div className="space-y-1.5">
          <Label>Technologies (comma-separated)</Label>
          <Input
            value={typeof form.technologies === "string" ? form.technologies : ""}
            onChange={(e) => update("technologies", e.target.value)}
            placeholder="React, Node.js, PostgreSQL"
          />
          <p className="text-xs text-muted-foreground">Separate each technology with a comma.</p>
        </div>

        <div className="space-y-1.5">
          <Label>What the Client Loved</Label>
          <Textarea value={form.whatClientLoved || ""} onChange={(e) => update("whatClientLoved", e.target.value)} rows={3} />
        </div>

        <div className="space-y-1.5">
          <Label>Challenges Overcome</Label>
          <Textarea value={form.challengesOvercome || ""} onChange={(e) => update("challengesOvercome", e.target.value)} rows={3} />
        </div>

        <div className="border-t border-border pt-6"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Settings</p></div>

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

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </AdminShell>
  );
}
