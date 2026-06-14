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

  // Get all existing techcrunch URLs in our DB
  const existing = await prisma.newsArticle.findMany({
    select: { url: true, slug: true },
  });
  const existingUrlMap = new Map(existing.map(e => [e.url, e.slug]));

  // For each article, extract TC links and find which are unsynced
  const result = articles
    .map((article) => {
      const matches = [...(article.content ?? "").matchAll(/href="(https:\/\/techcrunch\.com\/[^"]+)"/g)];
      const links = [...new Set(matches.map(m => m[1]))];
      const unsynced = links.filter(url => !existingUrlMap.has(url));
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
