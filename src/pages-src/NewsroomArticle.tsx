"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ExternalLink, Loader2, AlertCircle } from "lucide-react";
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
};

// GNews appends " [X chars]" to truncated content — strip it
function cleanContent(raw: string): string {
  return raw.replace(/\s*\[\d+ chars\]$/, "").trim();
}

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
        if (match) {
          setArticle(match);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [src]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } catch {
      return iso;
    }
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
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground leading-tight mb-6">
                {article.title}
              </h1>

              {/* Hero image */}
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

              {/* Description */}
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-5">
                {article.description}
              </p>

              {/* Content */}
              {article.content && cleanContent(article.content) && (
                <div className="prose prose-neutral dark:prose-invert max-w-none mb-10">
                  <p className="text-foreground leading-relaxed text-base whitespace-pre-line">
                    {cleanContent(article.content)}
                  </p>
                </div>
              )}

              {/* Attribution */}
              <div className="surface-glass rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Originally published by {article.source}</p>
                  <p className="text-xs text-muted-foreground">This is a summary. Read the complete article on the original source.</p>
                </div>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    Read Full Article <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>

            </motion.article>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default NewsroomArticle;
