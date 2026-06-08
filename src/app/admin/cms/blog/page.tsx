"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";

type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  published: boolean;
  date: string;
  featured: boolean;
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/cms/posts");
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/cms/posts/${id}`, { method: "DELETE" });
    setPosts((p) => p.filter((x) => x.id !== id));
  }

  return (
    <AdminShell title="Blog Posts">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{loading ? <span className="inline-block h-4 w-12 rounded bg-muted animate-pulse" /> : <>{posts.length} posts</>}</p>
          <Link href="/admin/cms/blog/new">
            <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Post</Button>
          </Link>
        </div>

        {loading ? (
          <AdminTableSkeleton cols={5} />
        ) : (
          <>
            {/* Desktop table */}
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
                      <td className="px-4 py-3 font-medium">
                        {post.title}
                        {post.featured && <Badge variant="outline" className="ml-2 text-xs">Featured</Badge>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{post.category}</td>
                      <td className="px-4 py-3">
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{post.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/cms/blog/${post.id}`}>
                            <Button variant="ghost" size="icon" className="w-8 h-8"><Pencil className="w-3.5 h-3.5" /></Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => handleDelete(post.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No posts yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
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
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                      {post.featured && <Badge variant="outline" className="text-xs">Featured</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3 justify-end">
                    <Link href={`/admin/cms/blog/${post.id}`}>
                      <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs"><Pencil className="w-3.5 h-3.5" /> Edit</Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="h-9 px-3 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
    </AdminShell>
  );
}
