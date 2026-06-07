import { prisma } from "@/lib/prisma";
import { extract } from "@extractus/article-extractor";
import { XMLParser } from "fast-xml-parser";

const GUARDIAN_QUERY = `startup OR SaaS OR "software development" OR fintech OR "AI automation" OR healthtech OR "tech startup"`;

// ── Helpers ──────────────────────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

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
  for (const pattern of patterns) cleaned = cleaned.replace(pattern, "");
  return cleaned;
}

function stripTechCrunchBoilerplate(html: string): string {
  let cleaned = html;
  const cutoffPatterns = [
    /When you purchase through links in our articles,[\s\S]*/i,
    /<p[^>]*>[^<]*When you purchase through links[^<]*<\/p>[\s\S]*/i,
  ];
  for (const p of cutoffPatterns) cleaned = cleaned.replace(p, "");
  const stripPatterns = [
    /<[^>]*>Topics<\/[^>]*>[\s\S]*/i,
    /<[^>]*>Subscribe for the industry['']s biggest tech news<\/[^>]*>[\s\S]*/i,
    /<[^>]*>Latest in AI<\/[^>]*>[\s\S]*/i,
    /<[^>]*>Latest in [^<]*<\/[^>]*>\s*(<[^>]*>[\s\S]*)?$/i,
  ];
  for (const p of stripPatterns) cleaned = cleaned.replace(p, "");
  return cleaned.trim();
}

function upgradeTcImage(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    u.searchParams.delete("w");
    u.searchParams.delete("h");
    u.searchParams.delete("crop");
    u.searchParams.delete("resize");
    return u.toString();
  } catch { return url; }
}

function upgradeTcContentImages(html: string): string {
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
  try { return new URL(url).pathname.replace(/^\//, "").replace(/\/$/, ""); }
  catch { return ""; }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type ArticleData = {
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

// ── Fetchers ──────────────────────────────────────────────────────────────────

function mapGuardianResult(a: any): ArticleData {
  const mainHtml = (a.fields?.main as string) ?? "";
  const mainImage = extractMainImage(mainHtml, (a.fields?.thumbnail as string) ?? null);
  const rawBody = (a.fields?.body as string) ?? "";
  return {
    url: a.webUrl as string,
    title: a.webTitle as string,
    description: (a.fields?.trailText as string) ?? "",
    content: stripGuardianBoilerplate(rawBody),
    image: mainImage,
    publishedAt: new Date(a.webPublicationDate),
    source: "The Guardian",
    sourceUrl: "https://theguardian.com",
    type: "guardian",
  };
}

async function fetchGuardianSection(key: string, section: string, pageSize: number, fromDate: string): Promise<ArticleData[]> {
  const url = new URL("https://content.guardianapis.com/search");
  url.searchParams.set("q", GUARDIAN_QUERY);
  url.searchParams.set("section", section);
  url.searchParams.set("show-fields", "thumbnail,body,trailText,main");
  url.searchParams.set("page-size", String(pageSize));
  url.searchParams.set("order-by", "newest");
  url.searchParams.set("from-date", fromDate);
  url.searchParams.set("api-key", key);
  const res = await fetch(url.toString());
  if (!res.ok) { console.error(`[news/sync] Guardian (${section}):`, res.status); return []; }
  const data = await res.json();
  return (data.response?.results ?? []).map(mapGuardianResult);
}

async function fetchGuardian(key: string): Promise<ArticleData[]> {
  const fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const [primaryResults, partialResults] = await Promise.all([
    Promise.all(["technology", "business", "science"].map(s => fetchGuardianSection(key, s, 15, fromDate))),
    Promise.all(["money", "global-development", "media"].map(s => fetchGuardianSection(key, s, 10, fromDate))),
  ]);
  const allResults = [...primaryResults.flat(), ...partialResults.flat()];
  const seen = new Set<string>();
  const deduplicated: ArticleData[] = [];
  for (const article of allResults) {
    if (!seen.has(article.url)) { seen.add(article.url); deduplicated.push(article); }
  }
  return deduplicated.slice(0, 30);
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

async function fetchLinkedGuardianArticles(key: string, primaryArticles: ArticleData[], existingUrls: Set<string>): Promise<ArticleData[]> {
  const primaryUrls = new Set(primaryArticles.map(a => a.url));
  const linkedUrls: string[] = [];
  for (const article of primaryArticles) {
    for (const link of extractGuardianLinks(article.content)) {
      if (!primaryUrls.has(link) && !existingUrls.has(link) && !linkedUrls.includes(link)) linkedUrls.push(link);
    }
  }
  const linked: ArticleData[] = [];
  const results = await Promise.allSettled(
    linkedUrls.slice(0, 5).map(url => {
      const path = guardianPathFromUrl(url);
      return path ? fetchGuardianByPath(key, path) : Promise.resolve(null);
    })
  );
  for (const r of results) { if (r.status === "fulfilled" && r.value) linked.push(r.value); }
  return linked;
}

async function fetchTechCrunch(existingUrls: Set<string>): Promise<ArticleData[]> {
  const RELEVANT_CATEGORIES = new Set([
    "AI", "AI compute", "Anthropic", "Apps", "Fintech", "Fundraising",
    "Fundraising Advice", "Government & Policy", "In Brief", "Microsoft",
    "OpenAI", "Security", "Startup Battlefield", "Startups", "Venture",
    "cybersecurity", "data centers", "Google", "Biotech & Health",
    "Exclusive", "Equity", "Roundup", "TC", "TechCrunch Disrupt 2026",
  ]);
  try {
    const res = await fetch("https://techcrunch.com/feed/");
    if (!res.ok) { console.error("[news/sync] TechCrunch RSS:", res.status); return []; }
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const feed = parser.parse(xml);
    const items = feed?.rss?.channel?.item ?? [];
    const candidates = Array.isArray(items) ? items.slice(0, 20) : [items];
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const entries = candidates.filter((item: any) => {
      const pubDate = new Date(item.pubDate).getTime();
      if (isNaN(pubDate) || pubDate < cutoff) return false;
      const cats = item.category;
      if (!cats) return false;
      const catArray: string[] = Array.isArray(cats) ? cats : [cats];
      return catArray.some(c => RELEVANT_CATEGORIES.has(c));
    }).slice(0, 10);
    const articles: ArticleData[] = [];
    for (const item of entries) {
      const url = item.link as string;
      if (!url || existingUrls.has(url)) continue;
      try {
        const extracted = await Promise.race([
          extract(url),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
        ]);
        if (!extracted) {
          articles.push({ url, title: (item.title as string) ?? "", description: (item.description as string)?.replace(/<[^>]+>/g, "").slice(0, 300) ?? "", content: "", image: upgradeTcImage(item["media:content"]?.["@_url"] ?? item["media:thumbnail"]?.["@_url"] ?? null), publishedAt: new Date(item.pubDate), source: "TechCrunch", sourceUrl: "https://techcrunch.com", type: "techcrunch" });
          continue;
        }
        articles.push({ url, title: extracted.title ?? (item.title as string) ?? "", description: extracted.description ?? (item.description as string)?.replace(/<[^>]+>/g, "").slice(0, 300) ?? "", content: upgradeTcContentImages(stripTechCrunchBoilerplate(extracted.content ?? "")), image: upgradeTcImage(extracted.image ?? item["media:content"]?.["@_url"] ?? item["media:thumbnail"]?.["@_url"] ?? null), publishedAt: new Date(extracted.published ?? item.pubDate), source: "TechCrunch", sourceUrl: "https://techcrunch.com", type: "techcrunch" });
      } catch {
        articles.push({ url, title: (item.title as string) ?? "", description: (item.description as string)?.replace(/<[^>]+>/g, "").slice(0, 300) ?? "", content: "", image: null, publishedAt: new Date(item.pubDate), source: "TechCrunch", sourceUrl: "https://techcrunch.com", type: "techcrunch" });
      }
    }
    return articles;
  } catch (err) { console.error("[news/sync] TechCrunch:", err); return []; }
}

// ── Core sync function ────────────────────────────────────────────────────────

export async function runNewsSync(source?: string | null): Promise<{ synced: number; total: number; breakdown: { guardian: number; techcrunch: number } }> {
  const guardianKey = process.env.GUARDIAN_API_KEY;
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
    const allGuardian = [...guardian, ...linkedGuardian];
    const availableUrls = new Set([...allGuardian.map(a => a.url), ...existingUrls]);
    for (const article of allGuardian) {
      if (article.content) {
        article.content = article.content.replace(
          /href="(https?:\/\/(?:www\.)?theguardian\.com\/[^"]+)"/g,
          (match, url) => availableUrls.has(url) ? `href="/newsroom/article?src=${encodeURIComponent(url)}"` : match
        );
      }
    }
    guardian = allGuardian;
  }

  if (!source || source === "techcrunch") {
    techcrunch = await fetchTechCrunch(existingUrls);
  }

  const allArticles = [...guardian, ...linkedGuardian.filter(a => !guardian.includes(a)), ...techcrunch];
  let upserted = 0;

  for (const article of allArticles) {
    const slug = generateSlug(article.title);
    await prisma.newsArticle.upsert({
      where: { url: article.url },
      create: { url: article.url, slug, title: article.title, description: article.description, content: article.content, image: article.image, publishedAt: article.publishedAt, source: article.source, sourceUrl: article.sourceUrl, type: article.type },
      update: { title: article.title, slug, description: article.description, content: article.content, image: article.image },
    });
    upserted++;
  }

  const total = await prisma.newsArticle.count();
  return { synced: upserted, total, breakdown: { guardian: guardian.length, techcrunch: techcrunch.length } };
}
