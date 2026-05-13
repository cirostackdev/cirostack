"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PORTFOLIO_VERTICALS, PORTFOLIO_SERVICES, PORTFOLIO_SIZES, PORTFOLIO_CATEGORIES } from "@/lib/admin-options";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";

export default function NewPortfolioPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    title: "",
    client: "",
    vertical: "",
    category: "",
    service: "",
    country: "",
    location: "",
    size: "",
    duration: "",
    year: "",
    description: "",
    aboutClient: "",
    challenge: "",
    solution: "",
    result: "",
    imageUrl: "",
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
      const res = await fetch("/api/admin/cms/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create");
      }
      toast.success("Project created");
      router.push("/admin/cms/portfolio");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="New Portfolio Project">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Slug *</Label>
            <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="healthflow" required />
          </div>
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="HealthFlow Dashboard" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Client *</Label>
            <Input value={form.client} onChange={(e) => update("client", e.target.value)} placeholder="MedTech Startup" required />
          </div>
          <div className="space-y-1.5">
            <Label>Vertical *</Label>
            <Select value={form.vertical} onValueChange={(v) => update("vertical", v)}>
              <SelectTrigger><SelectValue placeholder="Select vertical" /></SelectTrigger>
              <SelectContent>{PORTFOLIO_VERTICALS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => update("category", v)}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{PORTFOLIO_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Service *</Label>
            <Select value={form.service} onValueChange={(v) => update("service", v)}>
              <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
              <SelectContent>{PORTFOLIO_SERVICES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Input value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Nigeria" />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Lagos, Nigeria" />
          </div>
          <div className="space-y-1.5">
            <Label>Size</Label>
            <Select value={form.size} onValueChange={(v) => update("size", v)}>
              <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
              <SelectContent>{PORTFOLIO_SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Duration</Label>
            <Input value={form.duration} onChange={(e) => update("duration", e.target.value)} placeholder="12 weeks" />
          </div>
          <div className="space-y-1.5">
            <Label>Year</Label>
            <Input value={form.year} onChange={(e) => update("year", e.target.value)} placeholder="2025" />
          </div>
          <div className="space-y-1.5">
            <Label>Image URL</Label>
            <Input value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="/images/portfolio/..." />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Description *</Label>
          <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Short description for the portfolio grid" required rows={2} />
        </div>

        <div className="space-y-1.5">
          <Label>About Client</Label>
          <Textarea value={form.aboutClient} onChange={(e) => update("aboutClient", e.target.value)} rows={3} />
        </div>

        <div className="space-y-1.5">
          <Label>Challenge</Label>
          <Textarea value={form.challenge} onChange={(e) => update("challenge", e.target.value)} rows={3} />
        </div>

        <div className="space-y-1.5">
          <Label>Solution</Label>
          <Textarea value={form.solution} onChange={(e) => update("solution", e.target.value)} rows={3} />
        </div>

        <div className="space-y-1.5">
          <Label>Result</Label>
          <Textarea value={form.result} onChange={(e) => update("result", e.target.value)} rows={3} />
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

        <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Project"}</Button>
      </form>
    </AdminShell>
  );
}
