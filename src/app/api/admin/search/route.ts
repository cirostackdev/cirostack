import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const type = searchParams.get("type") ?? "all"; // "messages" | "conversations" | "all"

  if (!q) {
    return NextResponse.json({ messages: [], conversations: [] });
  }

  const results: {
    messages: Array<{
      id: string;
      body: string;
      createdAt: string;
      conversationId: string;
      visitorName: string | null;
      visitorEmail: string | null;
      topic: string | null;
      conversationCreatedAt: string;
    }>;
    conversations: Array<{
      id: string;
      visitorName: string | null;
      visitorEmail: string | null;
      topic: string | null;
      status: string;
      createdAt: string;
      updatedAt: string;
      lastMessage: string | null;
    }>;
  } = { messages: [], conversations: [] };

  // Search messages
  if (type === "messages" || type === "all") {
    const messages = await prisma.message.findMany({
      where: {
        body: { contains: q, mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        conversation: {
          select: {
            id: true,
            visitorName: true,
            visitorEmail: true,
            topic: true,
            createdAt: true,
          },
        },
      },
    });

    results.messages = messages.map((m) => ({
      id: m.id,
      body: m.body,
      createdAt: m.createdAt.toISOString(),
      conversationId: m.conversation.id,
      visitorName: m.conversation.visitorName,
      visitorEmail: m.conversation.visitorEmail,
      topic: m.conversation.topic,
      conversationCreatedAt: m.conversation.createdAt.toISOString(),
    }));
  }

  // Search conversations
  if (type === "conversations" || type === "all") {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { visitorName: { contains: q, mode: "insensitive" } },
          { visitorEmail: { contains: q, mode: "insensitive" } },
          { topic: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    results.conversations = conversations.map((c) => ({
      id: c.id,
      visitorName: c.visitorName,
      visitorEmail: c.visitorEmail,
      topic: c.topic,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      lastMessage: c.messages[0]?.body ?? null,
    }));
  }

  return NextResponse.json(results);
}
