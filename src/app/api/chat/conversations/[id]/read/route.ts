import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

// Visitor marks agent messages as read
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const visitorId = req.headers.get("x-visitor-id");
    if (!visitorId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const conv = await prisma.conversation.findUnique({ where: { id }, select: { visitorId: true } });
    if (!conv || conv.visitorId !== visitorId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderType: "agent",
        read: false,
      },
      data: { read: true },
    });

    // Notify admin that visitor read messages
    await pusher.trigger(`private-conversation-${id}`, "messages-read", { by: "visitor" });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/chat/conversations/[id]/read]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
