import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const category = req.nextUrl.searchParams.get("category");
  const responses = await prisma.cannedResponse.findMany({
    where: category ? { category } : undefined,
    orderBy: { title: "asc" },
  });

  return NextResponse.json(responses);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, shortcut, content, category } = await req.json();
  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Title and content required" }, { status: 400 });
  }

  const response = await prisma.cannedResponse.create({
    data: {
      title: title.trim(),
      shortcut: shortcut?.trim() || null,
      content: content.trim(),
      category: category?.trim() || "General",
      adminId: (session.user as any).id,
    },
  });

  return NextResponse.json(response, { status: 201 });
}
