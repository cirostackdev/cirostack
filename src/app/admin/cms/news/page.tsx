"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, ExternalLink, Pencil } from "lucide-react";
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

const SOURCE_COLORS: Record<string, string> = {
  techcrunch: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  manual: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null); // tracks which source is syncing
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

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
    </AdminShell>
  );
}
