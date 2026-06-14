import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const articles = await prisma.knowledgeArticle.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        category: true,
        createdAt: true,
      },
    });
    return NextResponse.json(articles);
  } catch (err) {
    console.error("[GET /api/portal/knowledge-base]", err);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
