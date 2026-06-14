"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Pencil,
  Trash2,
  BookMarked,
  Check,
  X,
  Search,
  Loader2,
} from "lucide-react";

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function KnowledgeBaseClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tableSelected, setTableSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [published, setPublished] = useState(false);
  const [order, setOrder] = useState(0);
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const res = await fetch("/api/admin/knowledge-base");
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch {
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitle("");
    setSlug("");
    setContent("");
    setCategory("General");
    setPublished(false);
    setOrder(0);
    setSlugManual(false);
    setEditing(null);
    setShowForm(false);
  }

  function openCreate() {
    resetForm();
    setShowForm(true);
  }

  function openEdit(article: Article) {
    setEditing(article);
    setTitle(article.title);
    setSlug(article.slug);
    setContent(article.content);
    setCategory(article.category);
    setPublished(article.published);
    setOrder(article.order);
    setSlugManual(true);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = { title, slug, content, category, published, order };

    try {
      if (editing) {
        const res = await fetch(`/api/admin/knowledge-base/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Article updated");
          resetForm();
          fetchArticles();
        } else {
          const data = await res.json();
          toast.error(data.error || "Failed to update");
        }
      } else {
        const res = await fetch("/api/admin/knowledge-base", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Article created");
          resetForm();
          fetchArticles();
        } else {
          const data = await res.json();
          toast.error(data.error || "Failed to create");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      const res = await fetch(`/api/admin/knowledge-base/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Article deleted");
        setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleting(null);
    }
  }

  async function confirmBulkDelete() {
    setBulkDeleting(true);
    await Promise.all([...tableSelected].map(id => fetch(`/api/admin/knowledge-base/${id}`, { method: "DELETE" })));
    setArticles(prev => prev.filter(a => !tableSelected.has(a.id)));
    setTableSelected(new Set());
    setShowBulkDelete(false);
    setBulkDeleting(false);
    toast.success("Articles deleted");
  }

  function toggleRow(id: string) {
    setTableSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function toggleAll() {
    const ids = filtered.map(a => a.id);
    setTableSelected(ids.every(id => tableSelected.has(id)) ? new Set() : new Set(ids));
  }

  async function togglePublished(article: Article) {
    try {
      const res = await fetch(`/api/admin/knowledge-base/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !article.published }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === article.id ? { ...a, published: !a.published } : a))
        );
        toast.success(article.published ? "Unpublished" : "Published");
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  const categories = Array.from(new Set(articles.map((a) => a.category)));
  const filtered = articles.filter((a) => {
    if (filterCategory !== "all" && a.category !== filterCategory) return false;
    if (search.trim() && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminShell title="Knowledge Base">
      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">
              {editing ? "Edit Article" : "New Article"}
            </h2>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slugManual) setSlug(slugify(e.target.value));
                  }}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Article title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugManual(true);
                  }}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="article-slug"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="General"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm">Published</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                placeholder="Article content (supports markdown)"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm text-muted-foreground">
            {loading ? <span className="inline-block h-4 w-14 rounded bg-muted animate-pulse" /> : (
              <>{search ? <><span className="text-foreground font-medium">{filtered.length}</span> of </> : null}{articles.length} articles</>
            )}
          </p>
          {!loading && categories.length > 0 && (
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              className="text-sm rounded-lg border border-border bg-background px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="all">All categories</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          )}
          {tableSelected.size > 0 && (
            <Button size="sm" variant="destructive" onClick={() => setShowBulkDelete(true)}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete {tableSelected.size} selected
            </Button>
          )}
        </div>
        {!showForm && (
          <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> New Article</Button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles…" className="pl-9" />
      </div>

      {/* Table */}
      {loading ? (
        <AdminTableSkeleton cols={5} />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-14 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-muted mx-auto flex items-center justify-center">
            <BookMarked className="w-7 h-7 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No articles yet</p>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
              Create knowledge base articles to help your clients find answers.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-3 w-8">
                    <button onClick={toggleAll} className={`w-4 h-4 rounded border-2 flex items-center justify-center ${filtered.length > 0 && filtered.every(a => tableSelected.has(a.id)) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                      {filtered.length > 0 && filtered.every(a => tableSelected.has(a.id)) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Published</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((article) => (
                  <tr key={article.id} className={`border-t border-border hover:bg-muted/20 transition-colors ${tableSelected.has(article.id) ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleRow(article.id)} className={`w-4 h-4 rounded border-2 flex items-center justify-center ${tableSelected.has(article.id) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                        {tableSelected.has(article.id) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium">{article.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs font-medium">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePublished(article)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-colors ${
                          article.published
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {article.published ? (
                          <>
                            <Check className="w-3 h-3" /> Published
                          </>
                        ) : (
                          "Draft"
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{article.order}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => openEdit(article)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(article)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile select all */}
          {filtered.length > 0 && (
            <div className="md:hidden flex items-center justify-between px-1 py-2 mb-1">
              <button onClick={toggleAll} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${filtered.every(a => tableSelected.has(a.id)) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                  {filtered.every(a => tableSelected.has(a.id)) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                </div>
                {filtered.every(a => tableSelected.has(a.id)) ? "Deselect All" : `Select All (${filtered.length})`}
              </button>
              {tableSelected.size > 0 && <span className="text-xs text-muted-foreground">{tableSelected.size} selected</span>}
            </div>
          )}

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.map((article) => (
              <div key={article.id} className={`p-4 rounded-xl border ${tableSelected.has(article.id) ? "border-primary bg-primary/5" : "border-border"} transition-colors`}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleRow(article.id)} className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${tableSelected.has(article.id) ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                    {tableSelected.has(article.id) && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{article.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs font-medium">{article.category}</span>
                      <button onClick={() => togglePublished(article)} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${article.published ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                        {article.published ? "Published" : "Draft"}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(article)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(article)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Bulk delete modal */}
      {showBulkDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0"><Trash2 className="w-5 h-5 text-destructive" /></div>
              <div>
                <h2 className="font-semibold">Delete {tableSelected.size} articles?</h2>
                <p className="text-xs text-muted-foreground mt-2">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowBulkDelete(false)} disabled={bulkDeleting}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={confirmBulkDelete} disabled={bulkDeleting}>
                {bulkDeleting ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Deleting…</> : `Delete ${tableSelected.size} Articles`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Single delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0"><Trash2 className="w-5 h-5 text-destructive" /></div>
              <div>
                <h2 className="font-semibold">Delete article?</h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">"{deleteTarget.title}"</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)} disabled={!!deleting}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={confirmDelete} disabled={!!deleting}>
                {deleting ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Deleting…</> : "Delete Article"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
