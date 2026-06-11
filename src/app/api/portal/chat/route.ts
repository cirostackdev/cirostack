import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";
import { pusher } from "@/lib/pusher";

// GET — active open conversation + messages (used for polling)
// Supports ?after=<messageId> to only fetch messages created after that message (delta fetch)
export async function GET(req: Request) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;
  const { searchParams } = new URL(req.url);
  const afterMessageId = searchParams.get("after");

  try {
    const conversation = await prisma.conversation.findFirst({
      where: { visitorId: clientId, status: "open" },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          ...(afterMessageId
            ? {
                where: {
                  createdAt: {
                    gt: (
                      await prisma.message.findUnique({
                        where: { id: afterMessageId },
                        select: { createdAt: true },
                      })
                    )?.createdAt ?? new Date(0),
                  },
                },
              }
            : {}),
        },
        assignedTo: { select: { name: true } },
      },
    });

    return NextResponse.json({ conversation: conversation ?? null });
  } catch (err) {
    console.error("[GET /api/portal/chat]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// PUT — send a message (creates conversation if none exists)
export async function PUT(req: Request) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;

  try {
    const { body, conversationId, fileUrl, replyToId, replyToBody, replyToSender } = await req.json();
    if (!body?.trim()) return NextResponse.json({ error: "body required" }, { status: 400 });

    // Get client info for the conversation
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { name: true, email: true },
    });

    let convId = conversationId as string | undefined;

    // Verify ownership if conversationId is provided
    if (convId) {
      const existingConv = await prisma.conversation.findFirst({
        where: { id: convId, visitorId: clientId },
        select: { id: true },
      });
      if (!existingConv) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Find or create open conversation
    if (!convId) {
      const existing = await prisma.conversation.findFirst({
        where: { visitorId: clientId, status: "open" },
        orderBy: { updatedAt: "desc" },
        select: { id: true },
      });

      if (existing) {
        convId = existing.id;
      } else {
        const conv = await prisma.conversation.create({
          data: {
            visitorId: clientId,
            visitorName: client?.name ?? null,
            visitorEmail: client?.email ?? null,
            topic: "Portal message",
            metadata: { source: "portal" },
          },
        });
        convId = conv.id;
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId: convId,
        senderType: "visitor",
        senderName: client?.name ?? null,
        body: body.trim(),
        ...(fileUrl ? { fileUrl } : {}),
        read: false,
        ...(replyToId ? { replyToId } : {}),
        ...(replyToBody ? { replyToBody: String(replyToBody).slice(0, 500) } : {}),
        ...(replyToSender ? { replyToSender: String(replyToSender).slice(0, 100) } : {}),
      },
    });

    // Touch conversation updatedAt
    await prisma.conversation.update({
      where: { id: convId },
      data: { updatedAt: new Date() },
    });

    // Notify admin via Pusher
    await pusher.trigger(`private-conversation-${convId}`, "new-message", { message });
    await pusher.trigger("private-admin-notifications", "new-message", { conversationId: convId });

    return NextResponse.json({ message, conversationId: convId });
  } catch (err) {
    console.error("[PUT /api/portal/chat]", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// PATCH — close a conversation (portal client can close their own)
export async function PATCH(req: Request) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;

  try {
    const { conversationId } = await req.json();
    if (!conversationId) return NextResponse.json({ error: "conversationId required" }, { status: 400 });

    // Verify ownership
    const conv = await prisma.conversation.findFirst({
      where: { id: conversationId, visitorId: clientId },
    });
    if (!conv) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { status: "closed" },
    });

    await pusher.trigger(`private-conversation-${conversationId}`, "conversation-closed", { conversationId });
    await pusher.trigger("private-admin-notifications", "conversation-closed-notification", { conversationId });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/portal/chat]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST — fetch ALL past conversations for history view
export async function POST() {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;

  try {
    const conversations = await prisma.conversation.findMany({
      where: { visitorId: clientId },
      orderBy: { updatedAt: "desc" },
      take: 20,
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        assignedTo: { select: { name: true } },
      },
    });

    return NextResponse.json({ conversations });
  } catch (err) {
    console.error("[POST /api/portal/chat]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
