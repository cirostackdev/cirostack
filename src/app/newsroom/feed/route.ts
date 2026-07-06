import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const SITE_URL = "https://cirostack.com";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = await prisma.newsArticle.findMany({
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const lastBuildDate = articles.length > 0
    ? new Date(articles[0].publishedAt).toUTCString()
    : new Date().toUTCString();

  const items = articles
    .map((article) => {
      const pubDate = new Date(article.publishedAt).toUTCString();
      const link = `${SITE_URL}/newsroom/${article.slug}`;
      const imageTag = article.image
        ? `\n      <enclosure url="${escapeXml(article.image)}" type="image/jpeg" length="0"/>\n      <media:content url="${escapeXml(article.image)}" medium="image"/>`
        : "";
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <source url="${escapeXml(article.sourceUrl || article.url)}">${escapeXml(article.source)}</source>
      <category>${escapeXml(article.type)}</category>${imageTag}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>CiroStack Newsroom</title>
    <link>${SITE_URL}/newsroom</link>
    <description>Curated tech news, industry insights, and engineering updates from CiroStack.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/newsroom/feed" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
