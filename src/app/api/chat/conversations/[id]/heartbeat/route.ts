import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { visitorId } = await req.json();

    if (!visitorId) return NextResponse.json({ error: "visitorId required" }, { status: 400 });

    const conv = await prisma.conversation.findFirst({
      where: { id, visitorId },
      select: { id: true, metadata: true },
    });
    if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.conversation.update({
      where: { id },
      data: {
        metadata: {
          ...((conv.metadata as Record<string, unknown>) ?? {}),
          visitorLastSeen: new Date().toISOString(),
        },
      },
    });

    await pusher.trigger(`private-conversation-${id}`, "visitor-presence", { online: true });
    await pusher.trigger("private-admin-notifications", "visitor-presence-notification", { conversationId: id, online: true });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[chat/conversations/[id]/heartbeat]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
