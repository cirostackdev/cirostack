import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const visitorId = url.searchParams.get("visitorId");

    if (!visitorId) {
      return NextResponse.json({ error: "visitorId required" }, { status: 400 });
    }

    const conversation = await prisma.conversation.findFirst({
      where: { id, visitorId },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("[api/chat/conversations/[id]/messages GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { visitorId, body, replyToId, replyToBody, replyToSender } = await req.json();

    if (!visitorId || !body?.trim()) {
      return NextResponse.json({ error: "visitorId and body required" }, { status: 400 });
    }

    // Verify ownership
    const conv = await prisma.conversation.findFirst({
      where: { id, visitorId },
      select: { id: true, status: true },
    });
    if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (conv.status === "closed") {
      return NextResponse.json({ error: "Conversation is closed" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderType: "visitor",
        body: body.trim().slice(0, 4000),
        ...(replyToId ? { replyToId } : {}),
        ...(replyToBody ? { replyToBody: String(replyToBody).slice(0, 500) } : {}),
        ...(replyToSender ? { replyToSender: String(replyToSender).slice(0, 100) } : {}),
      },
    });

    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    // Trigger Pusher event
    await pusher.trigger(`private-conversation-${id}`, "new-message", { message });
    // Notify admins
    await pusher.trigger("private-admin-notifications", "new-message", {
      conversationId: id,
      message,
    });

    // Push notification (fire and forget)
    import("@/lib/push").then(({ sendPushToAllAdmins }) =>
      sendPushToAllAdmins({ title: "New chat message", body: message.body.slice(0, 100), url: `/admin/conversations/${id}` })
    ).catch(() => {});

    return NextResponse.json({ message });
  } catch (err) {
    console.error("[api/chat/conversations/[id]/messages POST]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
