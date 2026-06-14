import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name, color } = await req.json();

  const tag = await prisma.conversationTag.update({
    where: { id },
    data: { ...(name && { name: name.trim() }), ...(color && { color }) },
  });

  return NextResponse.json(tag);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.conversationTag.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
