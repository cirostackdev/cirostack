import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { title, shortcut, content, category } = await req.json();

  const response = await prisma.cannedResponse.update({
    where: { id },
    data: {
      ...(title && { title: title.trim() }),
      shortcut: shortcut?.trim() || null,
      ...(content && { content: content.trim() }),
      ...(category && { category: category.trim() }),
    },
  });

  return NextResponse.json(response);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.cannedResponse.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
