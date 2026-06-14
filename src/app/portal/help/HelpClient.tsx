"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Search, BookOpen, ChevronDown, ChevronRight } from "lucide-react";

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  createdAt: string;
};

export default function HelpClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portal/knowledge-base")
      .then((r) => r.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(articles.map((a) => a.category)));

  const filtered = articles.filter((a) => {
    const matchesCategory = activeCategory === "all" || a.category === activeCategory;
    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function getExcerpt(content: string) {
    return content.length > 150 ? content.slice(0, 150) + "..." : content;
  }

  return (
    <PortalShell title="Help Center">
      <div className="w-full max-w-4xl mx-auto">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Category tabs / sidebar */}
          <div className="md:w-48 shrink-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Categories
            </h3>
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeCategory === "all"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </div>

          {/* Articles */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border border-border p-4 animate-pulse">
                    <div className="h-4 w-2/3 bg-muted rounded" />
                    <div className="h-3 w-full bg-muted rounded mt-3" />
                    <div className="h-3 w-1/2 bg-muted rounded mt-2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-14 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-muted mx-auto flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">No articles found</p>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
                    {search
                      ? "Try adjusting your search terms."
                      : "Help articles will appear here once published."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((article) => {
                  const isExpanded = expandedId === article.id;
                  return (
                    <div
                      key={article.id}
                      className="rounded-xl border border-border bg-card overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : article.id)}
                        className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/20 transition-colors"
                      >
                        <div className="mt-0.5 shrink-0 text-muted-foreground">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm">{article.title}</p>
                          {!isExpanded && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {getExcerpt(article.content)}
                            </p>
                          )}
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground shrink-0">
                          {article.category}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 pl-11">
                          <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground whitespace-pre-wrap">
                            {article.content}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
