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

  await prisma.message.updateMany({
    where: {
      conversationId: id,
      senderType: "visitor",
      read: false,
    },
    data: { read: true },
  });

  // Notify visitor that admin read their messages
  await pusher.trigger(`private-conversation-${id}`, "messages-read", { by: "admin" });

  return NextResponse.json({ ok: true });
}
