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

    // Verify caller owns this conversation (visitor side)
    const visitorId = req.headers.get("x-visitor-token");
    if (visitorId) {
      const conv = await prisma.conversation.findUnique({ where: { id }, select: { visitorToken: true } });
      if (!conv || conv.visitorToken !== visitorId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!emoji) return NextResponse.json({ error: "emoji required" }, { status: 400 });

    const message = await prisma.message.findFirst({
      where: { id: msgId, conversationId: id },
      select: { id: true, reactions: true },
    });

    if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const reactions = (message.reactions as Record<string, string[]>) ?? {};
    const reactor = reactorId || "visitor";

    // Find and remove any existing reaction from this person (one per person)
    const previous = Object.keys(reactions).find((e) => reactions[e]?.includes(reactor));
    if (previous) {
      reactions[previous] = reactions[previous].filter((r) => r !== reactor);
      if (reactions[previous].length === 0) delete reactions[previous];
    }

    // Add to new emoji — unless they tapped the same one (toggle off)
    if (previous !== emoji) {
      reactions[emoji] = [...(reactions[emoji] ?? []), reactor];
    }

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
