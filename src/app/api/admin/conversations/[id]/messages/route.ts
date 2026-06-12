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
  const { body, fileUrl, replyToId, replyToBody, replyToSender, replyToFileUrl } = await req.json();

  if (!body?.trim()) return NextResponse.json({ error: "body required" }, { status: 400 });

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      senderType: "agent",
      senderId: admin.id,
      senderName: admin.name,
      body: body.trim().slice(0, 4000),
      ...(fileUrl ? { fileUrl } : {}),
      ...(replyToId ? { replyToId } : {}),
      ...(replyToBody ? { replyToBody: String(replyToBody).slice(0, 500) } : {}),
      ...(replyToSender ? { replyToSender: String(replyToSender).slice(0, 100) } : {}),
      ...(replyToFileUrl ? { replyToFileUrl: String(replyToFileUrl) } : {}),
    },
  });

  await prisma.conversation.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  await pusher.trigger(`private-conversation-${id}`, "new-message", { message });

  return NextResponse.json({ message });
}
