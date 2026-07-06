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
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { dateSort: "desc" },
    take: 50,
  });

  const lastBuildDate = posts.length > 0
    ? new Date(posts[0].dateSort).toUTCString()
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const pubDate = new Date(post.dateSort).toUTCString();
      const link = `${SITE_URL}/blog/${post.slug}`;
      const imageTag = post.imageUrl
        ? `\n      <enclosure url="${escapeXml(post.imageUrl)}" type="image/jpeg" length="0"/>\n      <media:content url="${escapeXml(post.imageUrl)}" medium="image"/>`
        : "";
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(post.author)}</author>
      <category>${escapeXml(post.category)}</category>${imageTag}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>CiroStack Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Technical guides, case studies, and engineering insights from the CiroStack team: covering software architecture, AI, DevOps, and product development.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/feed" rel="self" type="application/rss+xml"/>
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
