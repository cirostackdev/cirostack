"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type Form = {
  slug: string; title: string; excerpt: string; category: string;
  author: string; date: string; dateSort: string; readMin: number;
  imageUrl: string; featured: boolean; published: boolean; tags: string; body: string;
};

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    fetch("/api/admin/cms/posts").then((r) => r.json()).then((posts: any[]) => {
      const post = posts.find((p) => p.id === id);
      if (post) {
        setForm({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          author: post.author,
          date: post.date,
          dateSort: post.dateSort ? post.dateSort.slice(0, 10) : post.date,
          readMin: post.readMin,
          imageUrl: post.imageUrl ?? "",
          featured: post.featured,
          published: post.published,
          tags: (post.tags ?? []).join(", "),
          body: post.body ?? "",
        });
      }
    });
  }, [id]);

  function set(key: string, value: unknown) {
    setForm((f) => f ? { ...f, [key]: value } : f);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/cms/upload", { method: "POST", body: fd });
    if (res.ok) { const { url } = await res.json(); set("imageUrl", url); toast.success("Image uploaded"); }
    else toast.error("Upload failed");
    setImageUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const res = await fetch(`/api/admin/cms/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    if (res.ok) { toast.success("Post updated"); router.push("/admin/cms/blog"); }
    else { const { error } = await res.json(); toast.error(error ?? "Failed"); }
    setSaving(false);
  }

  if (!form) return <AdminShell title="Edit Post"><div className="p-6 text-sm text-muted-foreground">Loading…</div></AdminShell>;

  return (
    <AdminShell title="Edit Blog Post">
      <form onSubmit={handleSubmit} className="p-6 max-w-3xl space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Slug *</Label><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} required /></div>
        </div>
        <div className="space-y-1.5"><Label>Excerpt *</Label><Textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} required rows={2} /></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5"><Label>Category *</Label><Input value={form.category} onChange={(e) => set("category", e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Author</Label><Input value={form.author} onChange={(e) => set("author", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Read (min)</Label><Input type="number" min={1} value={form.readMin} onChange={(e) => set("readMin", Number(e.target.value))} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Display Date</Label><Input value={form.date} onChange={(e) => set("date", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Sort Date</Label><Input type="date" value={form.dateSort} onChange={(e) => set("dateSort", e.target.value)} /></div>
        </div>
        <div className="space-y-1.5"><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => set("tags", e.target.value)} /></div>
        <div className="space-y-1.5">
          <Label>Cover Image</Label>
          <div className="flex items-center gap-3">
            {form.imageUrl && <img src={form.imageUrl} alt="" className="w-20 h-14 object-cover rounded-lg" />}
            <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} />
          </div>
        </div>
        <div className="space-y-1.5"><Label>Body (Markdown)</Label><Textarea value={form.body} onChange={(e) => set("body", e.target.value)} rows={12} className="font-mono text-sm" /></div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2"><Switch checked={form.featured} onCheckedChange={(v) => set("featured", v)} /><Label>Featured</Label></div>
          <div className="flex items-center gap-2"><Switch checked={form.published} onCheckedChange={(v) => set("published", v)} /><Label>Published</Label></div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </AdminShell>
  );
}
