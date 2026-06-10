import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pusher } from "@/lib/pusher";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const socketId = params.get("socket_id")!;
  const channel = params.get("channel_name")!;

  // Admin presence channel
  if (channel === "presence-chat-admins") {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const adminId = (session.user as any).id as string;
    const admin = await prisma.admin.findUnique({ where: { id: adminId }, select: { id: true, name: true } });
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const authResponse = pusher.authorizeChannel(socketId, channel, {
      user_id: admin.id,
      user_info: { name: admin.name },
    });
    return NextResponse.json(authResponse);
  }

  // Private conversation channels
  if (channel.startsWith("private-conversation-")) {
    const conversationId = channel.replace("private-conversation-", "");

    // Try admin auth first
    const session = await auth();
    if (session?.user) {
      const authResponse = pusher.authorizeChannel(socketId, channel);
      return NextResponse.json(authResponse);
    }

    // Visitor auth via header
    const visitorId = req.headers.get("x-visitor-id");
    if (visitorId) {
      const conv = await prisma.conversation.findFirst({
        where: { id: conversationId, visitorId },
        select: { id: true },
      });
      if (conv) {
        const authResponse = pusher.authorizeChannel(socketId, channel);
        return NextResponse.json(authResponse);
      }
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Private admin notifications channel
  if (channel === "private-admin-notifications") {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const authResponse = pusher.authorizeChannel(socketId, channel);
    return NextResponse.json(authResponse);
  }

  return NextResponse.json({ error: "Unknown channel" }, { status: 403 });
}
