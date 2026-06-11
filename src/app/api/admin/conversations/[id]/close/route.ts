import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.conversation.update({
    where: { id },
    data: { status: "closed" },
  });

  const msg = await prisma.message.create({
    data: {
      conversationId: id,
      senderType: "system",
      body: "This conversation has been closed.",
    },
  });

  await pusher.trigger(`private-conversation-${id}`, "new-message", { message: msg });
  await pusher.trigger(`private-conversation-${id}`, "conversation-closed", { conversationId: id });
  await pusher.trigger("private-admin-notifications", "conversation-closed-notification", { conversationId: id });

  return NextResponse.json({ ok: true });
}
