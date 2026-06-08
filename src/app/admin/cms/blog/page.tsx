"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";
import { PUBLISH_STATUS_COLORS } from "@/lib/colors";
import { CmsBooleanToggle } from "@/components/admin/CmsBooleanToggle";
import { toast } from "sonner";

type Post = { id: string; slug: string; title: string; category: string; published: boolean; date: string; featured: boolean };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/cms/posts");
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleToggle(id: string, field: string, value: boolean) {
    setSaving(`${id}-${field}`);
    const res = await fetch(`/api/admin/cms/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (res.ok) {
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
      toast.success("Updated");
    } else { toast.error("Failed to update"); }
    setSaving(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/cms/posts/${id}`, { method: "DELETE" });
    setPosts((p) => p.filter((x) => x.id !== id));
  }

  return (
    <AdminShell title="Blog Posts">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{loading ? <span className="inline-block h-4 w-12 rounded bg-muted animate-pulse" /> : <>{posts.length} posts</>}</p>
        <Link href="/admin/cms/blog/new"><Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Post</Button></Link>
      </div>
      {loading ? <AdminTableSkeleton cols={5} /> : (
        <>
          <div className="hidden md:block rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{post.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{post.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <CmsBooleanToggle id={post.id} value={post.published} onLabel="Published" offLabel="Draft" className="w-[76px] text-center" onClass={PUBLISH_STATUS_COLORS.published} offClass={PUBLISH_STATUS_COLORS.draft} onChange={(id, v) => handleToggle(id, "published", v)} saving={saving === `${post.id}-published`} />
                        <CmsBooleanToggle id={post.id} value={post.featured} onLabel="Featured" offLabel="Standard" onClass={PUBLISH_STATUS_COLORS.featured} offClass="bg-muted text-muted-foreground" onChange={(id, v) => handleToggle(id, "featured", v)} saving={saving === `${post.id}-featured`} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{post.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/cms/blog/${post.id}`}><Button variant="ghost" size="icon" className="w-8 h-8"><Pencil className="w-3.5 h-3.5" /></Button></Link>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => handleDelete(post.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No posts yet.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-2">
            {posts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No posts yet.</p>}
            {posts.map((post) => (
              <div key={post.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{post.category} · {post.date}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <CmsBooleanToggle id={post.id} value={post.published} onLabel="Published" offLabel="Draft" className="w-[76px] text-center" onClass={PUBLISH_STATUS_COLORS.published} offClass={PUBLISH_STATUS_COLORS.draft} onChange={(id, v) => handleToggle(id, "published", v)} saving={saving === `${post.id}-published`} />
                    <CmsBooleanToggle id={post.id} value={post.featured} onLabel="Featured" offLabel="Standard" onClass={PUBLISH_STATUS_COLORS.featured} offClass="bg-muted text-muted-foreground" onChange={(id, v) => handleToggle(id, "featured", v)} saving={saving === `${post.id}-featured`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 justify-end">
                  <Link href={`/admin/cms/blog/${post.id}`}><Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs"><Pencil className="w-3.5 h-3.5" /> Edit</Button></Link>
                  <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(post.id)}><Trash2 className="w-3.5 h-3.5" /> Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
