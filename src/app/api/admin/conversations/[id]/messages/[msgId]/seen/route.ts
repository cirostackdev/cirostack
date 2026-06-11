import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

const VALID_TYPES = ["listened", "watched", "clicked"] as const;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; msgId: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, msgId } = await params;
  const { type } = await req.json();
  if (!VALID_TYPES.includes(type)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const key = `_${type}`;

  const message = await prisma.message.findFirst({
    where: { id: msgId, conversationId: id },
    select: { id: true, reactions: true },
  });
  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const reactions = ((message.reactions as Record<string, string[]>) ?? {});
  if (reactions[key]) return NextResponse.json({ ok: true });

  const updated = { ...reactions, [key]: ["1"] };
  await prisma.message.update({ where: { id: msgId }, data: { reactions: updated } });
  await pusher.trigger(`private-conversation-${id}`, "reaction-update", { messageId: msgId, reactions: updated });

  return NextResponse.json({ ok: true });
}
