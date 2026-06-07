import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        source: true,
        type: true,
        publishedAt: true,
        image: true,
        fetchedAt: true,
      },
    });
    return NextResponse.json(articles);
  } catch (err) {
    console.error("[GET /api/admin/cms/news]", err);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
