import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { extract } from "@extractus/article-extractor";
import { generateSlug } from "@/lib/news-sync";

export const maxDuration = 60;

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await Promise.race([
      fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" } }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
    ]);
    if (!res || !res.ok) return null;
    const html = await res.text();
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ??
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
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
    u.searchParams.delete("w"); u.searchParams.delete("h");
    u.searchParams.delete("crop"); u.searchParams.delete("resize");
    return u.toString();
  } catch { return url; }
}

function upgradeTcContentImages(html: string): string {
  return html.replace(
    /(https:\/\/techcrunch\.com\/wp-content\/uploads\/[^"'\s]+)\?w=\d+/g,
    "$1?w=1200"
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { articleId } = await req.json();
  if (!articleId) return NextResponse.json({ error: "articleId required" }, { status: 400 });

  const article = await prisma.newsArticle.findUnique({ where: { id: articleId } });
  if (!article || !article.content) return NextResponse.json({ error: "Article not found or has no content" }, { status: 404 });

  // Extract all unique TC links from the article
  const matches = [...article.content.matchAll(/href="(https:\/\/techcrunch\.com\/[^"]+)"/g)];
  const linkedUrls = [...new Set(matches.map(m => m[1]))];

  // Find which are already in DB or blocklisted
  const [existing, blocklist] = await Promise.all([
    prisma.newsArticle.findMany({ where: { url: { in: linkedUrls } }, select: { url: true, slug: true } }),
    prisma.newsArticleBlocklist.findMany({ where: { url: { in: linkedUrls } }, select: { url: true } }),
  ]);
  const existingMap = new Map(existing.map(e => [e.url, e.slug]));
  const blocklistUrls = new Set(blocklist.map(b => b.url));
  const toScrape = linkedUrls.filter(url => !existingMap.has(url) && !blocklistUrls.has(url));

  const scraped: { url: string; slug: string }[] = [];
  const failed: string[] = [];

  // Scrape each unsynced link
  for (const url of toScrape) {
    try {
      const extracted = await Promise.race([
        extract(url),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000)),
      ]);

      const title = extracted?.title ?? url;

      // Auto-blocklist author/tag pages and short titles (1-2 words)
      const wordCount = title.trim().split(/\s+/).length;
      if (/^(Author|Tagged)\s*[-–]\s*/i.test(title) || wordCount <= 2) {
        await prisma.newsArticleBlocklist.upsert({
          where: { url },
          create: { url, title },
          update: { deletedAt: new Date() },
        });
        failed.push(url);
        continue;
      }

      const slug = generateSlug(title);
      const content = extracted?.content
        ? upgradeTcContentImages(stripTechCrunchBoilerplate(extracted.content))
        : "";

      // Fallback to OG image if article-extractor didn't find one
      const rawImage = extracted?.image ?? await fetchOgImage(url);
      const image = upgradeTcImage(rawImage);

      await prisma.newsArticle.upsert({
        where: { url },
        create: {
          url,
          slug,
          title,
          description: extracted?.description ?? "",
          content,
          image,
          publishedAt: extracted?.published ? new Date(extracted.published) : new Date(),
          source: "TechCrunch",
          sourceUrl: "https://techcrunch.com",
          type: "techcrunch",
        },
        update: { title, slug, description: extracted?.description ?? "", content, image },
      });

      scraped.push({ url, slug });
      existingMap.set(url, slug);
    } catch (err) {
      console.error("[sync-linked] failed to scrape:", url, err);
      failed.push(url);
    }
  }

  // Build full url→slug map (existing + newly scraped)
  const allUrlSlugs = new Map([...existingMap]);

  // Rewrite article content: replace techcrunch.com hrefs with internal /newsroom/[slug]
  let updatedContent = article.content;
  for (const [tcUrl, slug] of allUrlSlugs) {
    if (slug) {
      updatedContent = updatedContent.replaceAll(
        `href="${tcUrl}"`,
        `href="/newsroom/${slug}"`
      );
    }
  }

  // Save updated content back to the article
  await prisma.newsArticle.update({
    where: { id: articleId },
    data: { content: updatedContent },
  });

  return NextResponse.json({
    scraped: scraped.length,
    failed: failed.length,
    rewritten: allUrlSlugs.size,
    failedUrls: failed,
  });
}
