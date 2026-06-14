"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, ExternalLink, Pencil, Link2, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";

type Article = {
  id: string;
  slug: string | null;
  title: string;
  source: string;
  type: string;
  publishedAt: string;
  image: string | null;
  fetchedAt: string;
};

type UnsyncedItem = {
  id: string;
  title: string;
  slug: string | null;
  publishedAt: string;
  totalLinks: number;
  unsyncedLinks: number;
};

type SyncResult = { scraped: number; failed: number; rewritten: number; failedUrls: string[] };

const SOURCE_COLORS: Record<string, string> = {
  techcrunch: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  manual: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Sync linked articles modal
  const [showLinkedModal, setShowLinkedModal] = useState(false);
  const [unsyncedItems, setUnsyncedItems] = useState<UnsyncedItem[]>([]);
  const [loadingUnsynced, setLoadingUnsynced] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [syncingBatch, setSyncingBatch] = useState(false);
  const [syncResults, setSyncResults] = useState<Record<string, SyncResult | "error">>({});


  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/cms/news");
    if (res.ok) setArticles(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/admin/cms/news/${id}`, { method: "DELETE" });
    setArticles((a) => a.filter((x) => x.id !== id));
  }

  async function handleSync(source: "guardian" | "techcrunch" | "all") {
    setSyncing(source);
    setSyncStatus(null);
    try {
      const sources = source === "all" ? ["guardian", "techcrunch"] : [source];
      let totalSynced = 0;
      for (const s of sources) {
        const res = await fetch("/api/admin/cms/news/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: s }),
        });
        if (res.ok) {
          const data = await res.json();
          totalSynced += data.synced ?? 0;
        }
      }
      setSyncStatus(`Synced ${totalSynced} new article${totalSynced !== 1 ? "s" : ""}`);
      await load();
    } catch {
      setSyncStatus("Sync failed");
    } finally {
      setSyncing(null);
    }
  }

  async function openLinkedModal() {
    setShowLinkedModal(true);
    setLoadingUnsynced(true);
    setSyncResults({});
    setSelected(new Set());
    const res = await fetch("/api/admin/cms/news/unsynced-links");
    if (res.ok) setUnsyncedItems(await res.json());
    setLoadingUnsynced(false);
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    const eligible = unsyncedItems.filter(i => !syncResults[i.id]).map(i => i.id);
    const allSelected = eligible.every(id => selected.has(id));
    setSelected(allSelected ? new Set() : new Set(eligible));
  }

  async function handleSyncSelected() {
    if (selected.size === 0) return;
    setSyncingBatch(true);
    const ids = [...selected];
    for (const articleId of ids) {
      try {
        const res = await fetch("/api/admin/cms/news/sync-linked", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId }),
        });
        if (res.ok) {
          const result = await res.json();
          setSyncResults(prev => ({ ...prev, [articleId]: result }));
          setUnsyncedItems(prev => prev.filter(i => i.id !== articleId));
        } else {
          setSyncResults(prev => ({ ...prev, [articleId]: "error" }));
        }
      } catch {
        setSyncResults(prev => ({ ...prev, [articleId]: "error" }));
      }
    }
    setSelected(new Set());
    setSyncingBatch(false);
    await load();
  }

  const formatDate = (iso: string) => format(new Date(iso), "MMM d, yyyy");

  const techcrunch = articles.filter(a => a.type === "techcrunch");

  return (
    <AdminShell title="News">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm text-muted-foreground">
            {loading ? <span className="inline-block h-4 w-20 rounded bg-muted animate-pulse" /> : <>{articles.length} articles<span className="ml-2 text-muted-foreground/60">({techcrunch.length} TechCrunch)</span></>}
          </p>
          {syncStatus && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">{syncStatus}</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={openLinkedModal} disabled={syncing !== null}>
            <Link2 className="w-3.5 h-3.5 mr-1.5" />
            Sync Linked Articles
          </Button>
          <Button size="sm" onClick={() => handleSync("techcrunch")} disabled={syncing !== null}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${syncing === "techcrunch" || syncing === "all" ? "animate-spin" : ""}`} />
            Sync TechCrunch
          </Button>
        </div>
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
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Published</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fetched</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium max-w-sm">
                      <p className="truncate">{article.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={SOURCE_COLORS[article.type] ?? ""} variant="outline">
                        {article.source}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(article.publishedAt)}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(article.fetchedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/admin/cms/news/${article.id}`}>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        {article.slug && (
                          <Link href={`/newsroom/${article.slug}`} target="_blank">
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost" size="icon"
                          className="w-8 h-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(article.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No articles yet. Hit Sync All to fetch.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {articles.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No articles yet. Hit Sync All to fetch.</p>
            )}
            {articles.map((article) => (
              <div key={article.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm line-clamp-2">{article.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={SOURCE_COLORS[article.type] ?? ""} variant="outline">
                        {article.source}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 justify-end">
                  <Link href={`/admin/cms/news/${article.id}`}>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  {article.slug && (
                    <Link href={`/newsroom/${article.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost" size="icon"
                    className="w-8 h-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {/* Sync Linked Articles Modal */}
      {showLinkedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="font-semibold text-base flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary" /> Sync Linked Articles
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Articles that contain TechCrunch links not yet scraped into the DB.
                  Select one to scrape all its linked articles and rewrite links to internal URLs.
                </p>
              </div>
              <button onClick={() => setShowLinkedModal(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Select All bar */}
            {!loadingUnsynced && unsyncedItems.length > 0 && (() => {
              const eligible = unsyncedItems.filter(i => !syncResults[i.id]);
              const allSelected = eligible.length > 0 && eligible.every(i => selected.has(i.id));
              return (
                <div className="flex items-center justify-between px-6 py-2 border-b border-border bg-muted/20">
                  <button onClick={toggleSelectAll} disabled={syncingBatch} className="flex items-center gap-2 text-xs font-medium hover:text-primary transition-colors">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${allSelected ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                      {allSelected && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                    </div>
                    {allSelected ? "Deselect All" : `Select All (${eligible.length})`}
                  </button>
                  {selected.size > 0 && <span className="text-xs text-muted-foreground">{selected.size} selected</span>}
                </div>
              );
            })()}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              {loadingUnsynced ? (
                <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Checking for unsynced links…
                </div>
              ) : unsyncedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
                  <p className="font-medium">All linked articles are synced!</p>
                  <p className="text-sm text-muted-foreground mt-1">No articles have unsynced TechCrunch links.</p>
                </div>
              ) : (
                unsyncedItems.map((item) => {
                  const result = syncResults[item.id];
                  const isSelected = selected.has(item.id);
                  return (
                    <button
                      key={item.id}
                      disabled={syncingBatch || !!result}
                      onClick={() => !result && toggleSelect(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : result
                          ? "border-border"
                          : "border-border hover:bg-muted/30 cursor-pointer"
                      }`}
                    >
                      {/* Checkbox */}
                      {!result && (
                        <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
                          {isSelected && <span className="text-[9px] text-primary-foreground font-bold leading-none">✓</span>}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{formatDate(item.publishedAt)}</span>
                          <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-medium">
                            {item.unsyncedLinks} unsynced link{item.unsyncedLinks !== 1 ? "s" : ""}
                          </span>
                          <span className="text-[10px] text-muted-foreground/60">{item.totalLinks} total</span>
                        </div>
                      </div>

                      {result && result !== "error" && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 shrink-0">
                          <CheckCircle className="w-4 h-4" />
                          {result.scraped} scraped
                        </div>
                      )}
                      {result === "error" && (
                        <div className="flex items-center gap-1.5 text-xs text-destructive shrink-0">
                          <AlertCircle className="w-4 h-4" /> Failed
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <div className="px-6 py-3 border-t border-border flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {selected.size > 0 ? `${selected.size} article${selected.size !== 1 ? "s" : ""} selected` : "Select articles to sync"}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowLinkedModal(false)} disabled={syncingBatch}>Close</Button>
                {selected.size > 0 && (
                  <Button size="sm" onClick={handleSyncSelected} disabled={syncingBatch}>
                    {syncingBatch
                      ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Scraping…</>
                      : <><Link2 className="w-3.5 h-3.5 mr-1.5" /> Sync {selected.size} Article{selected.size !== 1 ? "s" : ""}</>
                    }
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
