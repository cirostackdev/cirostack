import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "30", 10)));
    const type = searchParams.get("type"); // "guardian" | "hackernews" | null (all)

    const where = type ? { type } : {};

    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.newsArticle.count({ where }),
    ]);

    // Map to the shape the frontend expects
    const mapped = articles.map(a => ({
      title: a.title,
      description: a.description,
      content: a.content,
      url: a.url,
      image: a.image,
      publishedAt: a.publishedAt.toISOString(),
      source: a.source,
      sourceUrl: a.sourceUrl,
      type: a.type,
      ...(a.type === "hackernews" ? {
        hnPoints: a.hnPoints,
        hnComments: a.hnComments,
        hnDiscussionUrl: a.hnDiscussionUrl,
      } : {}),
    }));

    return NextResponse.json({
      articles: mapped,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[api/news]", err);
    return NextResponse.json({ articles: [], pagination: { page: 1, limit: 30, total: 0, pages: 0 } });
  }
}
