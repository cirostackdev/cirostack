import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const article = await prisma.knowledgeArticle.findUnique({ where: { id } });
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(article);
  } catch (err) {
    console.error("[GET /api/admin/knowledge-base/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { title, slug, content, category, published, order } = await req.json();

    const article = await prisma.knowledgeArticle.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(published !== undefined && { published }),
        ...(order !== undefined && { order }),
      },
    });
    return NextResponse.json(article);
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (err?.code === "P2002") return NextResponse.json({ error: "An article with this slug already exists" }, { status: 409 });
    console.error("[PUT /api/admin/knowledge-base/[id]]", err);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.knowledgeArticle.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[DELETE /api/admin/knowledge-base/[id]]", err);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
