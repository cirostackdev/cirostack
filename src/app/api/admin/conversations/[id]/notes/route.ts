import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const notes = await prisma.internalNote.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "desc" },
    include: { admin: { select: { name: true } } },
  });

  return NextResponse.json(notes);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Body required" }, { status: 400 });

  const note = await prisma.internalNote.create({
    data: {
      conversationId: id,
      adminId: (session.user as any).id,
      body: body.trim(),
    },
    include: { admin: { select: { name: true } } },
  });

  return NextResponse.json(note, { status: 201 });
}
