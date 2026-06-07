"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BLOG_CATEGORIES } from "@/lib/admin-options";
import { toast } from "sonner";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    title: "",
    excerpt: "",
    category: "",
    author: "CiroStack Team",
    date: new Date().toISOString().slice(0, 10),
    dateSort: new Date().toISOString().slice(0, 10),
    readMin: 5,
    imageUrl: "",
    featured: false,
    published: false,
    tags: "",
    body: "",
  });

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/cms/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      set("imageUrl", url);
      toast.success("Image uploaded");
    } else {
      toast.error("Image upload failed");
    }
    setImageUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/cms/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      toast.success("Post created");
      router.push("/admin/cms/blog");
    } else {
      const { error } = await res.json();
      toast.error(error ?? "Failed to create post");
    }
    setSaving(false);
  }

  return (
    <AdminShell title="New Blog Post">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} required placeholder="my-post-slug" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="excerpt">Excerpt *</Label>
          <Textarea id="excerpt" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} required rows={2} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select value={form.category} onValueChange={(v) => set("category", v)} required>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{BLOG_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="author">Author</Label>
            <Input id="author" value={form.author} onChange={(e) => set("author", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="readMin">Read (min)</Label>
            <Input id="readMin" type="number" min={1} value={form.readMin} onChange={(e) => set("readMin", Number(e.target.value))} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="date">Display Date *</Label>
            <Input id="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dateSort">Sort Date</Label>
            <Input id="dateSort" type="date" value={form.dateSort} onChange={(e) => set("dateSort", e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="MVP, AI & ML, Fintech" />
        </div>

        <div className="space-y-1.5">
          <Label>Cover Image</Label>
          <div className="flex items-center gap-3">
            {form.imageUrl && <img src={form.imageUrl} alt="" className="w-20 h-14 object-cover rounded-lg" />}
            <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="body">Body (Markdown)</Label>
          <Textarea id="body" value={form.body} onChange={(e) => set("body", e.target.value)} rows={12} placeholder="Write your post in Markdown…" className="font-mono text-sm" />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch id="featured" checked={form.featured} onCheckedChange={(v) => set("featured", v)} />
            <Label htmlFor="featured">Featured</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="published" checked={form.published} onCheckedChange={(v) => set("published", v)} />
            <Label htmlFor="published">Published</Label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Create Post"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </AdminShell>
  );
}
