import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id }, select: { email: true } });
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const conversations = await prisma.conversation.findMany({
    where: { visitorEmail: client.email },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1, select: { body: true } },
      _count: { select: { messages: true } },
    },
  });

  return NextResponse.json(conversations.map((c) => ({
    id: c.id,
    topic: c.topic,
    status: c.status,
    lastMessage: c.messages[0]?.body || null,
    messageCount: c._count.messages,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  })));
}
