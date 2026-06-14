import { prisma } from "@/lib/prisma";
import { extract } from "@extractus/article-extractor";
import { XMLParser } from "fast-xml-parser";

// ── Helpers ──────────────────────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
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

export async function runNewsSync(): Promise<{ synced: number; total: number; breakdown: { techcrunch: number } }> {
  const [existingRecords, blocklist] = await Promise.all([
    prisma.newsArticle.findMany({ select: { url: true } }),
    prisma.newsArticleBlocklist.findMany({ select: { url: true } }),
  ]);
  const blocklistUrls = new Set(blocklist.map(b => b.url));
  const existingUrls = new Set([...existingRecords.map(r => r.url), ...blocklistUrls]);

  const techcrunch = await fetchTechCrunch(existingUrls);
  let upserted = 0;

  for (const article of techcrunch) {
    const slug = generateSlug(article.title);
    await prisma.newsArticle.upsert({
      where: { url: article.url },
      create: { url: article.url, slug, title: article.title, description: article.description, content: article.content, image: article.image, publishedAt: article.publishedAt, source: article.source, sourceUrl: article.sourceUrl, type: article.type },
      update: { title: article.title, slug, description: article.description, content: article.content, image: article.image },
    });
    upserted++;
  }

  const total = await prisma.newsArticle.count();
  return { synced: upserted, total, breakdown: { techcrunch: techcrunch.length } };
}
