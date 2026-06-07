import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extract } from "@extractus/article-extractor";
import { XMLParser } from "fast-xml-parser";

export const maxDuration = 60;

const GUARDIAN_QUERY = `startup OR SaaS OR "software development" OR fintech OR "AI automation" OR healthtech OR "tech startup"`;
const HN_QUERIES = ["startup", "SaaS", "AI", "fintech", "software"];

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

  const toFetch = linkedUrls.slice(0, 5);
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

async function fetchTechCrunch(existingUrls: Set<string>): Promise<ArticleData[]> {
  try {
    const res = await fetch("https://techcrunch.com/feed/");
    if (!res.ok) { console.error("[news/sync] TechCrunch RSS:", res.status); return []; }

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const feed = parser.parse(xml);

    const items = feed?.rss?.channel?.item ?? [];
    const entries = Array.isArray(items) ? items.slice(0, 5) : [items];

    const articles: ArticleData[] = [];

    for (const item of entries) {
      const url = item.link as string;
      if (!url || existingUrls.has(url)) continue;

      // Extract with a 5s timeout per article to stay within serverless limits
      try {
        const extracted = await Promise.race([
          extract(url),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
        ]);

        if (!extracted) {
          // Fallback: store RSS data only
          articles.push({
            url,
            title: (item.title as string) ?? "",
            description: (item.description as string)?.replace(/<[^>]+>/g, "").slice(0, 300) ?? "",
            content: "",
            image: item["media:content"]?.["@_url"] ?? item["media:thumbnail"]?.["@_url"] ?? null,
            publishedAt: new Date(item.pubDate),
            source: "TechCrunch",
            sourceUrl: "https://techcrunch.com",
            type: "techcrunch",
          });
          continue;
        }

        articles.push({
          url,
          title: extracted.title ?? (item.title as string) ?? "",
          description: extracted.description ?? (item.description as string)?.replace(/<[^>]+>/g, "").slice(0, 300) ?? "",
          content: extracted.content ?? "",
          image: extracted.image ?? item["media:content"]?.["@_url"] ?? item["media:thumbnail"]?.["@_url"] ?? null,
          publishedAt: new Date(extracted.published ?? item.pubDate),
          source: "TechCrunch",
          sourceUrl: "https://techcrunch.com",
          type: "techcrunch",
        });
      } catch (err) {
        console.error(`[news/sync] TechCrunch extract failed for ${url}:`, err);
        // Fallback: store RSS metadata
        articles.push({
          url,
          title: (item.title as string) ?? "",
          description: (item.description as string)?.replace(/<[^>]+>/g, "").slice(0, 300) ?? "",
          content: "",
          image: null,
          publishedAt: new Date(item.pubDate),
          source: "TechCrunch",
          sourceUrl: "https://techcrunch.com",
          type: "techcrunch",
        });
      }
    }

    return articles;
  } catch (err) {
    console.error("[news/sync] TechCrunch:", err);
    return [];
  }
}

async function fetchHackerNews(): Promise<ArticleData[]> {
  const results = await Promise.allSettled(
    HN_QUERIES.map(async (q) => {
      const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=10&numericFilters=points%3E20`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      return data.hits ?? [];
    })
  );

  const allHits = results.flatMap(r => r.status === "fulfilled" ? r.value : []);

  // Deduplicate by objectID
  const seen = new Set<string>();
  const unique = allHits.filter((h: any) => {
    if (!h.url || seen.has(h.objectID)) return false;
    seen.add(h.objectID);
    return true;
  });

  const articles: ArticleData[] = [];

  for (const h of unique.slice(0, 10)) {
    try {
      const extracted = await Promise.race([
        extract(h.url),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
      ]);

      articles.push({
        url: h.url as string,
        title: extracted?.title ?? (h.title as string),
        description: extracted?.description ?? "",
        content: extracted?.content ?? "",
        image: extracted?.image ?? null,
        publishedAt: new Date(h.created_at),
        source: "Hacker News",
        sourceUrl: "https://news.ycombinator.com",
        type: "hackernews",
        hnPoints: h.points as number,
        hnComments: h.num_comments as number,
        hnDiscussionUrl: `https://news.ycombinator.com/item?id=${h.objectID}`,
      });
    } catch {
      // Fallback: store metadata only
      articles.push({
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
      });
    }
  }

  return articles;
}

// ── Handler ─────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Protect with a secret (Vercel Cron sends this header, or pass as query param)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Optional: sync a single source to stay within serverless timeout
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source"); // "guardian" | "hackernews" | "techcrunch" | null (all)

  try {
    const guardianKey = process.env.GUARDIAN_API_KEY;

    // Get existing URLs to avoid re-fetching articles we already have
    const existingRecords = await prisma.newsArticle.findMany({ select: { url: true } });
    const existingUrls = new Set(existingRecords.map(r => r.url));

    let guardian: ArticleData[] = [];
    let linkedGuardian: ArticleData[] = [];
    let hn: ArticleData[] = [];
    let techcrunch: ArticleData[] = [];

    if (!source || source === "guardian") {
      guardian = guardianKey ? await fetchGuardian(guardianKey) : [];
      if (guardianKey && guardian.length > 0) {
        linkedGuardian = await fetchLinkedGuardianArticles(guardianKey, guardian, existingUrls);
      }
      // Rewrite Guardian links
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
      guardian = allGuardian;
    }

    if (!source || source === "hackernews") {
      hn = await fetchHackerNews();
    }

    if (!source || source === "techcrunch") {
      techcrunch = await fetchTechCrunch(existingUrls);
    }

    // Upsert all articles into database
    const allArticles = [...guardian, ...linkedGuardian.filter(a => !guardian.includes(a)), ...hn, ...techcrunch];
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
      source: source ?? "all",
      breakdown: { guardian: guardian.length, hn: hn.length, techcrunch: techcrunch.length },
    });
  } catch (err) {
    console.error("[news/sync]", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
