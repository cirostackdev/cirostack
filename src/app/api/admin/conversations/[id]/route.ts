import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const conv = await prisma.conversation.findUnique({
    where: { id },
    select: { id: true, status: true, metadata: true, assignedToId: true },
  });
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(conv);
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  // Whitelist only safe fields to prevent mass assignment
  const { status, assignedToId, metadata, subject } = body;
  const safeData: Record<string, unknown> = {};
  if (status !== undefined) safeData.status = status;
  if (assignedToId !== undefined) safeData.assignedToId = assignedToId;
  if (metadata !== undefined) safeData.metadata = metadata;
  if (subject !== undefined) safeData.subject = subject;

  try {
    const conv = await prisma.conversation.update({ where: { id }, data: safeData });
    return NextResponse.json(conv);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.message.deleteMany({ where: { conversationId: id } });
    await prisma.conversation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
