import { NextResponse } from "next/server";
import { pusher } from "@/lib/pusher";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { recording } = await req.json();

  const visitorId = req.headers.get("x-visitor-token");
  if (!visitorId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const conv = await prisma.conversation.findUnique({ where: { id }, select: { visitorToken: true } });
  if (!conv || conv.visitorToken !== visitorId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await pusher.trigger(`private-conversation-${id}`, "visitor-recording", { recording: !!recording });
  await pusher.trigger("private-admin-notifications", "visitor-recording-notification", {
    conversationId: id,
    recording: !!recording,
  });
  return NextResponse.json({ ok: true });
}
