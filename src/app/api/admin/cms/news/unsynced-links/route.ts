import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get all articles that have content with techcrunch.com links
  const articles = await prisma.newsArticle.findMany({
    where: { content: { contains: "techcrunch.com" } },
    select: { id: true, title: true, slug: true, publishedAt: true, content: true },
    orderBy: { publishedAt: "desc" },
  });

  // Get all existing URLs in DB and blocklist
  const [existing, blocklist] = await Promise.all([
    prisma.newsArticle.findMany({ select: { url: true, slug: true } }),
    prisma.newsArticleBlocklist.findMany({ select: { url: true } }),
  ]);
  const existingUrlMap = new Map(existing.map(e => [e.url, e.slug]));
  const blocklistUrls = new Set(blocklist.map(b => b.url));

  // Normalize a TC URL for consistent comparison (remove trailing slash, strip query/hash)
  function normalizeUrl(url: string): string {
    try {
      const u = new URL(url);
      return `${u.origin}${u.pathname.replace(/\/$/, "")}`;
    } catch { return url.replace(/[?#].*$/, "").replace(/\/$/, ""); }
  }

  const normalizedExisting = new Map([...existingUrlMap].map(([url, slug]) => [normalizeUrl(url), slug]));
  const normalizedBlocklist = new Set([...blocklistUrls].map(normalizeUrl));

  // For each article, extract TC article links (only /YYYY/MM/DD/ pattern) and find which are unsynced
  const result = articles
    .map((article) => {
      // Only match TC article URLs (must contain /YYYY/ path segment — excludes wp-content, tags, authors, categories)
      const matches = [...(article.content ?? "").matchAll(/href="(https:\/\/techcrunch\.com\/\d{4}\/[^"]+)"/g)];
      const links = [...new Set(matches.map(m => normalizeUrl(m[1])))];
      const unsynced = links.filter(url => !normalizedExisting.has(url) && !normalizedBlocklist.has(url));
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        publishedAt: article.publishedAt,
        totalLinks: links.length,
        unsyncedLinks: unsynced.length,
        unsyncedUrls: unsynced,
      };
    })
    .filter(a => a.unsyncedLinks > 0);

  return NextResponse.json(result);
}
