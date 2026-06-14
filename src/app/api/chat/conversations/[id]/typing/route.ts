import { NextResponse } from "next/server";
import { pusher } from "@/lib/pusher";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { typing } = await req.json();

  // Verify caller owns this conversation
  const visitorId = req.headers.get("x-visitor-id");
  if (!visitorId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const conv = await prisma.conversation.findUnique({ where: { id }, select: { visitorId: true } });
  if (!conv || conv.visitorId !== visitorId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await pusher.trigger(`private-conversation-${id}`, "visitor-typing", { typing: !!typing });
  // Also notify the admin notification channel so the conversation list can show "typing..."
  await pusher.trigger("private-admin-notifications", "visitor-typing-notification", {
    conversationId: id,
    typing: !!typing,
  });
  return NextResponse.json({ ok: true });
}
