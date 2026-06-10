import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; msgId: string }> }
) {
  try {
    const { id, msgId } = await params;
    const { emoji, reactorId } = await req.json();

    if (!emoji) return NextResponse.json({ error: "emoji required" }, { status: 400 });

    const message = await prisma.message.findFirst({
      where: { id: msgId, conversationId: id },
      select: { id: true, reactions: true },
    });

    if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const reactions = (message.reactions as Record<string, string[]>) ?? {};
    const arr = reactions[emoji] ?? [];
    const reactor = reactorId || "visitor";

    if (arr.includes(reactor)) {
      reactions[emoji] = arr.filter((r) => r !== reactor);
    } else {
      reactions[emoji] = [...arr, reactor];
    }

    // Clean up empty arrays
    if (reactions[emoji].length === 0) delete reactions[emoji];

    await prisma.message.update({
      where: { id: msgId },
      data: { reactions },
    });

    await pusher.trigger(`private-conversation-${id}`, "reaction-update", {
      messageId: msgId,
      reactions,
    });

    return NextResponse.json({ reactions });
  } catch (err) {
    console.error("[POST /api/chat/conversations/[id]/messages/[msgId]/react]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
