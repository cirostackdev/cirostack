"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ExternalLink, Loader2, AlertCircle, TrendingUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

type Article = {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: string;
  sourceUrl: string | null;
  type: "guardian" | "hackernews";
  hnPoints?: number;
  hnComments?: number;
  hnDiscussionUrl?: string;
};

const NewsroomArticle = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const src = searchParams.get("src");

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!src) { setNotFound(true); setLoading(false); return; }
    const targetUrl = decodeURIComponent(src);
    fetch("/api/news")
      .then(r => r.json())
      .then((articles: Article[]) => {
        const match = articles.find(a => a.url === targetUrl);
        match ? setArticle(match) : setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [src]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } catch { return iso; }
  };

  const sourceDomain = (url: string) => {
    try { return new URL(url).hostname.replace("www.", ""); }
    catch { return url; }
  };

  return (
    <Layout>
      <section className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">

          <Link href="/newsroom" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Newsroom
          </Link>

          {loading && (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            </div>
          )}

          {notFound && !loading && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <AlertCircle className="w-10 h-10 text-muted-foreground mb-4" />
              <h2 className="text-xl font-display font-semibold text-foreground mb-2">Article not found</h2>
              <p className="text-muted-foreground mb-6">This article may have expired from our news feed.</p>
              <Button onClick={() => router.push("/newsroom")}>Back to Newsroom</Button>
            </div>
          )}

          {article && !loading && (
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

              {/* Source + date */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">{article.source}</span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(article.publishedAt)}
                </span>
                {article.type === "hackernews" && article.hnPoints !== undefined && (
                  <>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="w-3.5 h-3.5" /> {article.hnPoints} points
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageSquare className="w-3.5 h-3.5" /> {article.hnComments} comments
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground leading-tight mb-6">
                {article.title}
              </h1>

              {/* Guardian: hero image */}
              {article.image && (
                <div className="rounded-2xl overflow-hidden mb-8 bg-secondary">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full object-cover max-h-[420px]"
                    onError={e => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = "none"; }}
                  />
                </div>
              )}

              {/* Guardian: description pull-quote */}
              {article.description && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-5">
                  {article.description}
                </p>
              )}

              {/* Guardian: full article body */}
              {article.type === "guardian" && article.content && (
                <div className="mb-10 space-y-4">
                  {article.content.split("\n\n").filter(Boolean).map((para, i) => (
                    <p key={i} className="text-foreground leading-relaxed text-base">{para}</p>
                  ))}
                </div>
              )}

              {/* HackerNews: no body — show info card + prominent CTA */}
              {article.type === "hackernews" && (
                <div className="surface-glass rounded-2xl p-8 text-center mb-10">
                  <p className="text-sm text-muted-foreground mb-2">This article is hosted on</p>
                  <p className="text-lg font-display font-semibold text-foreground mb-6">{sourceDomain(article.url)}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full sm:w-auto">
                      Read Full Article <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              )}

              {/* Attribution footer */}
              <div className="surface-glass rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {article.type === "guardian" ? "Originally published by The Guardian" : "Shared via Hacker News"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {article.type === "guardian"
                      ? "Content reproduced with attribution. Read the original on theguardian.com."
                      : "Visit the Hacker News discussion for community commentary."}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      {article.type === "guardian" ? "Original Article" : "Read Article"} <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </a>
                  {article.type === "hackernews" && article.hnDiscussionUrl && (
                    <a href={article.hnDiscussionUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        HN Discussion <MessageSquare className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>

            </motion.article>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default NewsroomArticle;
