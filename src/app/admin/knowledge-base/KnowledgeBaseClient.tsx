"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  BookMarked,
  Check,
  X,
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

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/knowledge-base/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Article deleted");
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleting(null);
    }
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
  const filteredArticles =
    filterCategory === "all" ? articles : articles.filter((a) => a.category === filterCategory);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {loading ? (
              <span className="inline-block h-4 w-14 rounded bg-muted animate-pulse" />
            ) : (
              <>{filteredArticles.length} articles</>
            )}
          </p>
          {!loading && categories.length > 0 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-sm rounded-lg border border-border bg-background px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
        {!showForm && (
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1" /> New Article
          </Button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <AdminTableSkeleton cols={5} />
      ) : filteredArticles.length === 0 ? (
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
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Published</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="border-t border-border hover:bg-muted/20 transition-colors">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(article.id)}
                          disabled={deleting === article.id}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{article.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs font-medium">
                        {article.category}
                      </span>
                      <button
                        onClick={() => togglePublished(article)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                          article.published
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {article.published ? "Published" : "Draft"}
                      </button>
                      <span className="text-xs text-muted-foreground">
                        Order: {article.order}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => openEdit(article)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(article.id)}
                      disabled={deleting === article.id}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
