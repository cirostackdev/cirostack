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
