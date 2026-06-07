"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ExternalLink, Loader2, AlertCircle,
  Twitter, Linkedin, LinkIcon, Check, Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import heroNewsroom from "@/assets/hero-newsroom.jpg";

// ── Types ────────────────────────────────────────────────────────────────────

type Article = {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: string;
  sourceUrl: string | null;
  type: "guardian" | "techcrunch";
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  } catch { return iso; }
}

function formatDateShort(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return iso; }
}

function sourceDomain(url: string) {
  try { return new URL(url).hostname.replace("www.", ""); }
  catch { return url; }
}

function getCategoryLabel(article: { title: string; description: string }): string {
  const text = `${article.title} ${article.description}`.toLowerCase();
  if (/\bai\b|machine learning|llm|gpt|anthropic|openai/.test(text)) return "AI & Machine Learning";
  if (/startup|venture|fundrais|seed round|series [abc]/.test(text)) return "Startups & Funding";
  if (/fintech|payment|banking|crypto|blockchain/.test(text)) return "Fintech";
  if (/security|hack|breach|ransomware|cyber|privacy/.test(text)) return "Cybersecurity";
  if (/software|saas|developer|devtools|api/.test(text)) return "Software & Apps";
  if (/enterprise|data center|cloud|infrastructure/.test(text)) return "Enterprise & Cloud";
  return "Tech";
}

// ── Reading progress bar ─────────────────────────────────────────────────────

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (el.scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted/50">
      <div className="h-full bg-primary transition-[width] duration-100 ease-out" style={{ width: `${progress}%` }} />
    </div>
  );
}

// ── Share buttons ────────────────────────────────────────────────────────────

function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const share = (platform: "twitter" | "linkedin") => {
    const enc = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${t}&url=${enc}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Share</p>
      <div className="flex gap-2">
        <button onClick={() => share("twitter")} className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Share on Twitter">
          <Twitter className="h-4 w-4" />
        </button>
        <button onClick={() => share("linkedin")} className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Share on LinkedIn">
          <Linkedin className="h-4 w-4" />
        </button>
        <button onClick={copyLink} className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Copy link">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function ShareButtonsInline({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const share = (platform: "twitter" | "linkedin") => {
    const enc = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${t}&url=${enc}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-1.5">
      <button onClick={() => share("twitter")} className="p-1.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Share on Twitter">
        <Twitter className="h-3.5 w-3.5" />
      </button>
      <button onClick={() => share("linkedin")} className="p-1.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Share on LinkedIn">
        <Linkedin className="h-3.5 w-3.5" />
      </button>
      <button onClick={copyLink} className="p-1.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Copy link">
        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <LinkIcon className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

// ── Guardian body renderer ───────────────────────────────────────────────────

function GuardianBody({ content }: { content: string }) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (href?.startsWith("/newsroom/article")) {
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="guardian-article prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-display prose-headings:text-foreground prose-headings:font-bold
        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-primary/80
        prose-strong:text-foreground prose-strong:font-semibold
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5
        prose-blockquote:rounded-r-xl prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic
        prose-blockquote:text-foreground
        prose-figure:my-8 prose-figure:rounded-2xl prose-figure:overflow-hidden
        prose-img:rounded-xl prose-img:w-full prose-img:my-0
        prose-figcaption:text-sm prose-figcaption:text-muted-foreground prose-figcaption:mt-3 prose-figcaption:px-1
        prose-ul:space-y-2 prose-ol:space-y-2
        prose-li:text-muted-foreground"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

// ── Main component ───────────────────────────────────────────────────────────

const NewsroomArticle = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const src = searchParams.get("src");

  const [article, setArticle] = useState<Article | null>(null);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [src]);

  useEffect(() => {
    if (!src) { setNotFound(true); setLoading(false); return; }
    const targetUrl = decodeURIComponent(src);
    fetch("/api/news?limit=30")
      .then(r => r.json())
      .then((data) => {
        const articles: Article[] = data?.articles ?? data;
        setAllArticles(Array.isArray(articles) ? articles : []);
        const match = (Array.isArray(articles) ? articles : []).find(a => a.url === targetUrl);
        match ? setArticle(match) : setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [src]);

  const related = useMemo(() => {
    if (!article) return [];
    const others = allArticles.filter(a => a.url !== article.url);
    const currentCategory = getCategoryLabel(article);

    // Score: same category = 3, same source = 1, base = 0
    const scored = others.map(a => ({
      article: a,
      score: (getCategoryLabel(a) === currentCategory ? 3 : 0) + (a.type === article.type ? 1 : 0),
    }));

    // Sort by score desc, then by date desc
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.article.publishedAt).getTime() - new Date(a.article.publishedAt).getTime();
    });

    return scored.slice(0, 3).map(s => s.article);
  }, [allArticles, article]);

  if (loading) {
    return (
      <Layout>
        <div className="pt-28 pb-16">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            {/* Hero skeleton */}
            <div className="animate-pulse">
              <div className="h-6 w-32 bg-muted rounded mb-4" />
              <div className="h-10 w-full bg-muted rounded mb-3" />
              <div className="h-10 w-3/4 bg-muted rounded mb-6" />
              <div className="h-4 w-48 bg-muted rounded mb-10" />
            </div>

            <div className="flex gap-10">
              {/* Sidebar skeleton */}
              <aside className="hidden lg:block w-56 shrink-0 animate-pulse">
                <div className="h-3 w-16 bg-muted rounded mb-3" />
                <div className="h-4 w-36 bg-muted rounded mb-8" />
                <div className="h-3 w-12 bg-muted rounded mb-3" />
                <div className="flex gap-2">
                  <div className="w-9 h-9 bg-muted rounded-lg" />
                  <div className="w-9 h-9 bg-muted rounded-lg" />
                  <div className="w-9 h-9 bg-muted rounded-lg" />
                </div>
              </aside>

              {/* Content skeleton */}
              <div className="flex-1 max-w-3xl animate-pulse space-y-6">
                <div className="border-l-4 border-muted rounded-r-xl px-6 py-5">
                  <div className="h-5 w-full bg-muted rounded mb-2" />
                  <div className="h-5 w-4/5 bg-muted rounded" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-5/6 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                </div>
                <div className="h-64 w-full bg-muted rounded-xl" />
                <div className="space-y-4">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (notFound) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <AlertCircle className="w-10 h-10 text-muted-foreground mb-4" />
          <h2 className="text-xl font-display font-semibold text-foreground mb-2">Article not found</h2>
          <p className="text-muted-foreground mb-6">This article may have expired from our news feed.</p>
          <Button onClick={() => router.push("/newsroom")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Newsroom
          </Button>
        </div>
      </Layout>
    );
  }

  if (!article) return null;

  const heroImage = article.image ?? heroNewsroom;

  return (
    <Layout>
      <ReadingProgressBar />

      <PageHero
        icon={Newspaper}
        title={article.title}
        description={formatDate(article.publishedAt)}
        image={heroImage}
        ctaText="Back to Newsroom"
        ctaLink="/newsroom"
      />

      <article className="section-padding">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex gap-10">

            {/* Sticky sidebar */}
            <aside className="hidden lg:block w-56 shrink-0 sticky top-24 self-start">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Published</p>
                <span className="text-sm text-muted-foreground">{formatDate(article.publishedAt)}</span>
              </div>

              <ShareButtons title={article.title} />
            </aside>

            {/* Main content */}
            <div className="flex-1 max-w-3xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

                {/* Mobile: share buttons */}
                <div className="flex items-center gap-3 mb-8 lg:hidden">
                  <span className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</span>
                  <div className="ml-auto">
                    <ShareButtonsInline title={article.title} />
                  </div>
                </div>

                {/* Description pull-quote */}
                {article.description && (
                  <div className="border-l-4 border-primary bg-primary/5 rounded-r-xl px-6 py-5 mb-10">
                    <p className="text-foreground leading-relaxed text-lg font-medium">{article.description}</p>
                  </div>
                )}

                {/* Full article body */}
                {article.content && (
                  <GuardianBody content={article.content} />
                )}

                {/* External article card (no full body available) */}
                {!article.content && (
                  <div className="surface-glass rounded-2xl p-10 text-center">
                    <p className="text-sm text-muted-foreground mb-2">This article is hosted on</p>
                    <p className="text-2xl font-display font-bold text-foreground mb-2">{sourceDomain(article.url)}</p>
                    <p className="text-sm text-muted-foreground mb-8">The full article body is available at the original source.</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="w-full sm:w-auto">
                        Read Full Article <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                )}



              </motion.div>
            </div>
          </div>
        </div>
      </article>

      {/* More from Industry News */}
      {related.length > 0 && (
        <section className="section-padding section-alt">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">More Industry News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((a, i) => (
                <motion.div
                  key={a.url}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div
                    onClick={() => router.push(`/newsroom/article?src=${encodeURIComponent(a.url)}`)}
                    className="block group cursor-pointer"
                  >
                    <div className="rounded-2xl surface-glass hover-lift overflow-hidden">
                      {a.image && (
                        <div className="h-36 overflow-hidden">
                          <img
                            src={a.image}
                            alt={a.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={e => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = "none"; }}
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-medium text-primary">{getCategoryLabel(a)}</span>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="text-xs text-muted-foreground">{formatDateShort(a.publishedAt)}</span>
                        </div>
                        <h3 className="font-display font-semibold text-foreground text-sm mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">{a.title}</h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default NewsroomArticle;
