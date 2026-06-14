import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

const VALID_TYPES = ["listened", "watched", "clicked"] as const;
type SeenType = (typeof VALID_TYPES)[number];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; msgId: string }> }
) {
  const { id, msgId } = await params;
  const { type } = await req.json();

  // Verify caller owns this conversation
  const visitorId = req.headers.get("x-visitor-token");
  if (!visitorId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const conv = await prisma.conversation.findUnique({ where: { id }, select: { visitorToken: true } });
  if (!conv || conv.visitorToken !== visitorId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!VALID_TYPES.includes(type)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const key = `_${type}` as const; // _listened | _watched | _clicked

  const message = await prisma.message.findFirst({
    where: { id: msgId, conversationId: id },
    select: { id: true, reactions: true },
  });
  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const reactions = ((message.reactions as Record<string, string[]>) ?? {});
  if (reactions[key]) return NextResponse.json({ ok: true }); // already marked

  const updated = { ...reactions, [key]: ["1"] };
  await prisma.message.update({ where: { id: msgId }, data: { reactions: updated } });
  await pusher.trigger(`private-conversation-${id}`, "reaction-update", { messageId: msgId, reactions: updated });

  return NextResponse.json({ ok: true });
}
