"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminFormSkeleton } from "@/components/admin/AdminSkeletons";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function EditNewsArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/cms/news/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setForm({
          ...d,
          publishedAt: d.publishedAt ? d.publishedAt.slice(0, 10) : "",
        });
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
      const res = await fetch(`/api/admin/cms/news/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Article updated");
      router.push("/admin/cms/news");
    } catch {
      toast.error("Failed to update article");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminShell title="Edit Article"><AdminFormSkeleton /></AdminShell>;
  if (!form) return <AdminShell title="Edit Article"><p>Article not found</p></AdminShell>;

  return (
    <AdminShell title={`Edit: ${form.title}`}>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">

        {/* ── Basic Info ─────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <Label>Title *</Label>
          <Input value={form.title || ""} onChange={(e) => update("title", e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input value={form.slug || ""} onChange={(e) => update("slug", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Published At</Label>
            <Input type="date" value={form.publishedAt || ""} onChange={(e) => update("publishedAt", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Source</Label>
            <Input value={form.source || ""} onChange={(e) => update("source", e.target.value)} placeholder="e.g. TechCrunch" />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type || "techcrunch"} onValueChange={(v) => update("type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="techcrunch">TechCrunch</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── URLs ───────────────────────────────────────────────────── */}
        <div className="border-t border-border pt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">URLs</p>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Article URL</Label>
              <div className="flex gap-2">
                <Input value={form.url || ""} onChange={(e) => update("url", e.target.value)} className="flex-1" />
                {form.url && (
                  <Link href={form.url} target="_blank">
                    <Button type="button" variant="outline" size="icon"><ExternalLink className="w-4 h-4" /></Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Source URL</Label>
              <Input value={form.sourceUrl || ""} onChange={(e) => update("sourceUrl", e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label>Cover Image URL</Label>
              <div className="flex gap-3 items-center">
                {form.image && <img src={form.image} alt="" className="w-20 h-14 object-cover rounded-lg shrink-0" />}
                <Input value={form.image || ""} onChange={(e) => update("image", e.target.value)} placeholder="https://..." className="flex-1" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ────────────────────────────────────────────────── */}
        <div className="border-t border-border pt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Content</p>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description || ""} onChange={(e) => update("description", e.target.value)} rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Full Content <span className="text-muted-foreground font-normal">(HTML supported)</span></Label>
              <Textarea value={form.content || ""} onChange={(e) => update("content", e.target.value)} rows={12} className="font-mono text-xs" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/cms/news")}>Cancel</Button>
        </div>
      </form>
    </AdminShell>
  );
}
