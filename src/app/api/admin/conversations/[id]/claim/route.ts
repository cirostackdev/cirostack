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

  const adminId = (session.user as any).id as string;
  const admin = await prisma.admin.findUnique({ where: { id: adminId }, select: { id: true, name: true } });
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Check current assignment
  const existing = await prisma.conversation.findUnique({
    where: { id },
    select: { assignedToId: true },
  });

  // Already assigned to someone else — reject
  if (existing?.assignedToId && existing.assignedToId !== admin.id) {
    return NextResponse.json({ error: "Already assigned to another agent" }, { status: 409 });
  }

  // Already assigned to this admin — skip the join message, just return
  if (existing?.assignedToId === admin.id) {
    const conv = await prisma.conversation.findUnique({ where: { id } });
    return NextResponse.json({ conversation: conv });
  }

  // First time claiming — assign and create the join message
  const conv = await prisma.conversation.update({
    where: { id },
    data: { assignedToId: admin.id },
  });

  const msg = await prisma.message.create({
    data: {
      conversationId: id,
      senderType: "system",
      body: `${admin.name} has joined the conversation.`,
    },
  });
  await pusher.trigger(`private-conversation-${id}`, "new-message", { message: msg });

  return NextResponse.json({ conversation: conv });
}
