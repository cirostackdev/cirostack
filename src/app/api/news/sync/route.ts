import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extract } from "@extractus/article-extractor";
import { XMLParser } from "fast-xml-parser";

export const maxDuration = 60;

const GUARDIAN_QUERY = `startup OR SaaS OR "software development" OR fintech OR "AI automation" OR healthtech OR "tech startup"`;

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

function stripTechCrunchBoilerplate(html: string): string {
  let cleaned = html;

  // Strip everything from the affiliate commission disclaimer onward
  const cutoffPatterns = [
    /When you purchase through links in our articles,[\s\S]*/i,
    /<p[^>]*>[^<]*When you purchase through links[^<]*<\/p>[\s\S]*/i,
  ];
  for (const pattern of cutoffPatterns) {
    cleaned = cleaned.replace(pattern, "");
  }

  // Strip footer boilerplate sections
  const stripPatterns = [
    /<[^>]*>Topics<\/[^>]*>[\s\S]*/i,
    /<[^>]*>Subscribe for the industry['']s biggest tech news<\/[^>]*>[\s\S]*/i,
    /<[^>]*>Latest in AI<\/[^>]*>[\s\S]*/i,
    /<[^>]*>Latest in [^<]*<\/[^>]*>\s*(<[^>]*>[\s\S]*)?$/i,
  ];
  for (const pattern of stripPatterns) {
    cleaned = cleaned.replace(pattern, "");
  }

  return cleaned.trim();
}

/** Upgrade TechCrunch image URL to full resolution */
function upgradeTcImage(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    // Remove WordPress resize params to get full-res
    u.searchParams.delete("w");
    u.searchParams.delete("h");
    u.searchParams.delete("crop");
    u.searchParams.delete("resize");
    return u.toString();
  } catch {
    return url;
  }
}

/** Upgrade all image URLs inside TechCrunch HTML content */
function upgradeTcContentImages(html: string): string {
  // Replace ?w=small with ?w=1200 for inline images
  return html.replace(
    /(https:\/\/techcrunch\.com\/wp-content\/uploads\/[^"'\s]+)\?w=\d+/g,
    "$1?w=1200"
  );
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
            image: upgradeTcImage(item["media:content"]?.["@_url"] ?? item["media:thumbnail"]?.["@_url"] ?? null),
            publishedAt: new Date(item.pubDate),
            source: "TechCrunch",
            sourceUrl: "https://techcrunch.com",
            type: "techcrunch",
          });
          continue;
        }

        const rawContent = extracted.content ?? "";
        const cleanedContent = upgradeTcContentImages(stripTechCrunchBoilerplate(rawContent));

        articles.push({
          url,
          title: extracted.title ?? (item.title as string) ?? "",
          description: extracted.description ?? (item.description as string)?.replace(/<[^>]+>/g, "").slice(0, 300) ?? "",
          content: cleanedContent,
          image: upgradeTcImage(extracted.image ?? item["media:content"]?.["@_url"] ?? item["media:thumbnail"]?.["@_url"] ?? null),
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
  const source = searchParams.get("source"); // "guardian" | "techcrunch" | null (all)

  try {
    const guardianKey = process.env.GUARDIAN_API_KEY;

    // Get existing URLs to avoid re-fetching articles we already have
    const existingRecords = await prisma.newsArticle.findMany({ select: { url: true } });
    const existingUrls = new Set(existingRecords.map(r => r.url));

    let guardian: ArticleData[] = [];
    let linkedGuardian: ArticleData[] = [];
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

    if (!source || source === "techcrunch") {
      techcrunch = await fetchTechCrunch(existingUrls);
    }

    // Upsert all articles into database
    const allArticles = [...guardian, ...linkedGuardian.filter(a => !guardian.includes(a)), ...techcrunch];
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
        },
        update: {
          title: article.title,
          description: article.description,
          content: article.content,
          image: article.image,
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
      breakdown: { guardian: guardian.length, techcrunch: techcrunch.length },
    });
  } catch (err) {
    console.error("[news/sync]", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
