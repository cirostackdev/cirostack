import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const article = await prisma.newsArticle.findUnique({ where: { id } });
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(article);
  } catch (err) {
    console.error("[GET /api/admin/cms/news/:id]", err);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { id: _id, fetchedAt, updatedAt, ...data } = body;
    // Convert publishedAt string to Date if provided
    if (data.publishedAt) data.publishedAt = new Date(data.publishedAt);
    const article = await prisma.newsArticle.update({ where: { id }, data });
    return NextResponse.json(article);
  } catch (err) {
    console.error("[PATCH /api/admin/cms/news/:id]", err);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: Params
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const article = await prisma.newsArticle.findUnique({ where: { id }, select: { url: true, title: true } });
    if (article) {
      await prisma.newsArticleBlocklist.upsert({
        where: { url: article.url },
        create: { url: article.url, title: article.title },
        update: { deletedAt: new Date() },
      });
    }
    await prisma.newsArticle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/cms/news/:id]", err);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
