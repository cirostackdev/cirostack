import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; msgId: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminId = (session.user as any).id as string;

  try {
    const { id, msgId } = await params;
    const { emoji } = await req.json();

    if (!emoji) return NextResponse.json({ error: "emoji required" }, { status: 400 });

    const message = await prisma.message.findFirst({
      where: { id: msgId, conversationId: id },
      select: { id: true, reactions: true },
    });

    if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const reactions = (message.reactions as Record<string, string[]>) ?? {};

    // Find and remove any existing reaction from this admin (one per person)
    const previous = Object.keys(reactions).find((e) => reactions[e]?.includes(adminId));
    if (previous) {
      reactions[previous] = reactions[previous].filter((r) => r !== adminId);
      if (reactions[previous].length === 0) delete reactions[previous];
    }

    // Add to new emoji — unless they tapped the same one (toggle off)
    if (previous !== emoji) {
      reactions[emoji] = [...(reactions[emoji] ?? []), adminId];
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
    console.error("[POST /api/admin/conversations/[id]/messages/[msgId]/react]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
