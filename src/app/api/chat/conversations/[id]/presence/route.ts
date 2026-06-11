import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { visitorId, online } = await req.json();

    if (!visitorId) return NextResponse.json({ error: "visitorId required" }, { status: 400 });

    const conv = await prisma.conversation.findFirst({
      where: { id, visitorId },
      select: { id: true },
    });
    if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await pusher.trigger(`private-conversation-${id}`, "visitor-presence", { online: !!online });
    await pusher.trigger("private-admin-notifications", "visitor-presence-notification", { conversationId: id, online: !!online });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[chat/conversations/[id]/presence]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
