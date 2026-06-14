import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '');
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await prisma.newsArticle.findUnique({
      where: { slug },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Strip unresolvable links from content before serving
    let content = article.content ?? "";
    if (content) {
      // Collect all hrefs in the article
      const hrefMatches = [...content.matchAll(/href="([^"]+)"/g)];
      const internalSlugs = [...new Set(
        hrefMatches
          .map(m => m[1])
          .filter(h => h.startsWith("/newsroom/"))
          .map(h => h.replace("/newsroom/", ""))
      )];

      // Check which internal slugs actually exist
      const existingSlugs = internalSlugs.length > 0
        ? new Set((await prisma.newsArticle.findMany({
            where: { slug: { in: internalSlugs } },
            select: { slug: true },
          })).map(a => a.slug))
        : new Set<string>();

      // Strip all external links (techcrunch.com unsynced + any other external site)
      const allExternalUrls = [...new Set(
        hrefMatches
          .map(m => m[1])
          .filter(h => h.startsWith("http://") || h.startsWith("https://"))
      )];

      for (const url of allExternalUrls) {
        content = content.replace(
          new RegExp(`<a[^>]*href="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>([\\s\\S]*?)<\\/a>`, "g"),
          "$1"
        );
      }

      // Strip internal /newsroom/[slug] links where the slug doesn't exist
      for (const s of internalSlugs) {
        if (!existingSlugs.has(s)) {
          const escapedHref = `/newsroom/${s}`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          content = content.replace(
            new RegExp(`<a[^>]*href="${escapedHref}"[^>]*>([\\s\\S]*?)<\\/a>`, "g"),
            "$1"
          );
        }
      }
    }

    return NextResponse.json({
      title: article.title,
      description: article.description,
      content: sanitizeHtml(content),
      url: article.url,
      slug: article.slug,
      image: article.image,
      publishedAt: article.publishedAt.toISOString(),
      source: article.source,
      sourceUrl: article.sourceUrl,
      type: article.type,
    });
  } catch (err) {
    console.error("[api/news/[slug]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
