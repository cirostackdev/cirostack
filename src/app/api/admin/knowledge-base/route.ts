import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const articles = await prisma.knowledgeArticle.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(articles);
  } catch (err) {
    console.error("[GET /api/admin/knowledge-base]", err);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, slug, content, category, published, order } = await req.json();
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "title, slug, and content are required" }, { status: 400 });
    }

    const article = await prisma.knowledgeArticle.create({
      data: {
        title,
        slug,
        content,
        category: category ?? "General",
        published: published ?? false,
        order: order ?? 0,
      },
    });
    return NextResponse.json(article, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "An article with this slug already exists" }, { status: 409 });
    }
    console.error("[POST /api/admin/knowledge-base]", err);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
