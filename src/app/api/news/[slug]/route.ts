import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json({
      title: article.title,
      description: article.description,
      content: article.content,
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
