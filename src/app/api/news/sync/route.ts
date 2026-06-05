import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

const GUARDIAN_QUERY = `startup OR SaaS OR "software development" OR fintech OR "AI automation" OR healthtech OR "tech startup"`;
const HN_QUERY = "startup software development SaaS AI fintech";

// ── Helpers ─────────────────────────────────────────────────────────────────

function extractMainImage(mainHtml: string, thumbnail: string | null): string | null {
  const match = mainHtml.match(/src="([^"]+)"/);
  return match?.[1] ?? thumbnail ?? null;
}

function stripGuardianBoilerplate(html: string): string {
  let cleaned = html;
  const patterns = [
    /<h2[^>]*>\s*Essential reads\s*<\/h2>\s*<ul[\s\S]*?<\/ul>/gi,
    /<p[^>]*>\s*<strong>\s*Read more:?\s*<\/strong>\s*<\/p>\s*<ul[\s\S]*?<\/ul>/gi,
    /<h2[^>]*>\s*Read more:?\s*<\/h2>\s*<ul[\s\S]*?<\/ul>/gi,
    /<p[^>]*>\s*<strong>\s*Essential reads\s*<\/strong>\s*<\/p>\s*<ul[\s\S]*?<\/ul>/gi,
    /<p[^>]*>[^<]*subscribe to receive[^<]*<\/p>/gi,
    /<p[^>]*>[^<]*sign up for[^<]*newsletter[^<]*<\/p>/gi,
    /<p[^>]*>\s*[•▪]\s*To read the complete version[^<]*<\/p>/gi,
    /<h2[^>]*>\s*Topics\s*<\/h2>\s*<ul[\s\S]*?<\/ul>/gi,
    /<p[^>]*>\s*<em>[^<]*subscribe[^<]*<\/em>\s*<\/p>/gi,
  ];
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, "");
  }
  return cleaned;
}

function extractGuardianLinks(html: string): string[] {
  const regex = /href="(https?:\/\/(?:www\.)?theguardian\.com\/[^"]+)"/g;
  const links: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    const url = m[1];
    if (url.includes("/commentisfree/") || url.includes("/technology/") ||
        url.includes("/business/") || url.includes("/science/") ||
        url.includes("/world/") || url.includes("/uk-news/") ||
        url.includes("/us-news/") || url.includes("/environment/") ||
        url.includes("/money/") || url.includes("/global-development/")) {
      links.push(url);
    }
  }
  return [...new Set(links)];
}

function guardianPathFromUrl(url: string): string {
  try {
    return new URL(url).pathname.replace(/^\//, "").replace(/\/$/, "");
  } catch { return ""; }
}

// ── Fetchers ────────────────────────────────────────────────────────────────

type ArticleData = {
  url: string;
  title: string;
  description: string;
  content: string;
  image: string | null;
  publishedAt: Date;
  source: string;
  sourceUrl: string | null;
  type: string;
  hnPoints?: number;
  hnComments?: number;
  hnDiscussionUrl?: string;
};

function mapGuardianResult(a: any): ArticleData {
  const mainHtml = (a.fields?.main as string) ?? "";
  const mainImage = extractMainImage(mainHtml, (a.fields?.thumbnail as string) ?? null);
  const rawBody = (a.fields?.body as string) ?? "";
  const content = stripGuardianBoilerplate(rawBody);

  return {
    url: a.webUrl as string,
    title: a.webTitle as string,
    description: (a.fields?.trailText as string) ?? "",
    content,
    image: mainImage,
    publishedAt: new Date(a.webPublicationDate),
    source: "The Guardian",
    sourceUrl: "https://theguardian.com",
    type: "guardian",
  };
}

async function fetchGuardian(key: string): Promise<ArticleData[]> {
  const url = new URL("https://content.guardianapis.com/search");
  url.searchParams.set("q", GUARDIAN_QUERY);
  url.searchParams.set("section", "technology");
  url.searchParams.set("show-fields", "thumbnail,body,trailText,main");
  url.searchParams.set("page-size", "20");
  url.searchParams.set("order-by", "newest");
  url.searchParams.set("api-key", key);

  const res = await fetch(url.toString());
  if (!res.ok) { console.error("[news/sync] Guardian:", res.status); return []; }

  const data = await res.json();
  return (data.response?.results ?? []).map(mapGuardianResult);
}

async function fetchGuardianByPath(key: string, path: string): Promise<ArticleData | null> {
  const url = new URL(`https://content.guardianapis.com/${path}`);
  url.searchParams.set("show-fields", "thumbnail,body,trailText,main");
  url.searchParams.set("api-key", key);

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const data = await res.json();
  const content = data.response?.content;
  if (!content) return null;
  return mapGuardianResult(content);
}

async function fetchLinkedGuardianArticles(
  key: string,
  primaryArticles: ArticleData[],
  existingUrls: Set<string>
): Promise<ArticleData[]> {
  const primaryUrls = new Set(primaryArticles.map(a => a.url));
  const linkedUrls: string[] = [];

  for (const article of primaryArticles) {
    const links = extractGuardianLinks(article.content);
    for (const link of links) {
      if (!primaryUrls.has(link) && !existingUrls.has(link) && !linkedUrls.includes(link)) {
        linkedUrls.push(link);
      }
    }
  }

  const toFetch = linkedUrls.slice(0, 20);
  const linked: ArticleData[] = [];

  for (let i = 0; i < toFetch.length; i += 5) {
    const batch = toFetch.slice(i, i + 5);
    const results = await Promise.allSettled(
      batch.map(url => {
        const path = guardianPathFromUrl(url);
        return path ? fetchGuardianByPath(key, path) : Promise.resolve(null);
      })
    );
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        linked.push(r.value);
      }
    }
  }

  return linked;
}

async function fetchHackerNews(): Promise<ArticleData[]> {
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(HN_QUERY)}&tags=story&hitsPerPage=20&numericFilters=points%3E10`;
  const res = await fetch(url);
  if (!res.ok) { console.error("[news/sync] HN:", res.status); return []; }

  const data = await res.json();
  return (data.hits ?? []).filter((h: any) => !!h.url).map((h: any) => ({
    url: h.url as string,
    title: h.title as string,
    description: "",
    content: "",
    image: null,
    publishedAt: new Date(h.created_at),
    source: "Hacker News",
    sourceUrl: "https://news.ycombinator.com",
    type: "hackernews",
    hnPoints: h.points as number,
    hnComments: h.num_comments as number,
    hnDiscussionUrl: `https://news.ycombinator.com/item?id=${h.objectID}`,
  }));
}

// ── Handler ─────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Protect with a secret (Vercel Cron sends this header, or pass as query param)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const guardianKey = process.env.GUARDIAN_API_KEY;

    // Fetch from sources
    const [guardianArticles, hnArticles] = await Promise.allSettled([
      guardianKey ? fetchGuardian(guardianKey) : Promise.resolve([]),
      fetchHackerNews(),
    ]);

    const guardian = guardianArticles.status === "fulfilled" ? guardianArticles.value : [];
    const hn = hnArticles.status === "fulfilled" ? hnArticles.value : [];

    // Get existing URLs to avoid re-fetching linked articles we already have
    const existingRecords = await prisma.newsArticle.findMany({ select: { url: true } });
    const existingUrls = new Set(existingRecords.map(r => r.url));

    // Fetch linked Guardian articles
    let linkedGuardian: ArticleData[] = [];
    if (guardianKey && guardian.length > 0) {
      linkedGuardian = await fetchLinkedGuardianArticles(guardianKey, guardian, existingUrls);
    }

    // Rewrite Guardian links in all articles
    const allGuardian = [...guardian, ...linkedGuardian];
    const availableUrls = new Set([...allGuardian.map(a => a.url), ...existingUrls]);

    for (const article of allGuardian) {
      if (article.content) {
        article.content = article.content.replace(
          /href="(https?:\/\/(?:www\.)?theguardian\.com\/[^"]+)"/g,
          (match, url) => {
            if (availableUrls.has(url)) {
              return `href="/newsroom/article?src=${encodeURIComponent(url)}"`;
            }
            return match;
          }
        );
      }
    }

    // Upsert all articles into database
    const allArticles = [...allGuardian, ...hn];
    let upserted = 0;

    for (const article of allArticles) {
      await prisma.newsArticle.upsert({
        where: { url: article.url },
        create: {
          url: article.url,
          title: article.title,
          description: article.description,
          content: article.content,
          image: article.image,
          publishedAt: article.publishedAt,
          source: article.source,
          sourceUrl: article.sourceUrl,
          type: article.type,
          hnPoints: article.hnPoints ?? null,
          hnComments: article.hnComments ?? null,
          hnDiscussionUrl: article.hnDiscussionUrl ?? null,
        },
        update: {
          title: article.title,
          description: article.description,
          content: article.content,
          image: article.image,
          hnPoints: article.hnPoints ?? undefined,
          hnComments: article.hnComments ?? undefined,
        },
      });
      upserted++;
    }

    const total = await prisma.newsArticle.count();

    return NextResponse.json({
      success: true,
      synced: upserted,
      total,
      sources: { guardian: guardian.length, linked: linkedGuardian.length, hn: hn.length },
    });
  } catch (err) {
    console.error("[news/sync]", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
