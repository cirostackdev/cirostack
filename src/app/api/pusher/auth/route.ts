import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { clientAuth } from "@/auth-client";
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

  // Private conversation channels — admin, visitor, or portal client
  if (channel.startsWith("private-conversation-")) {
    const conversationId = channel.replace("private-conversation-", "");

    // Admin auth
    const session = await auth();
    if (session?.user) {
      return NextResponse.json(pusher.authorizeChannel(socketId, channel));
    }

    // Visitor auth via token (cryptographic proof)
    const visitorToken = req.headers.get("x-visitor-token");
    if (visitorToken) {
      const conv = await prisma.conversation.findFirst({
        where: { id: conversationId, visitorToken },
        select: { id: true },
      });
      if (conv) {
        return NextResponse.json(pusher.authorizeChannel(socketId, channel));
      }
    }

    // Portal client auth
    const clientSession = await clientAuth();
    if (clientSession?.user) {
      const clientId = (clientSession.user as any).id as string;
      const conv = await prisma.conversation.findFirst({
        where: { id: conversationId, visitorId: clientId },
        select: { id: true },
      });
      if (conv) {
        return NextResponse.json(pusher.authorizeChannel(socketId, channel));
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
    return NextResponse.json(pusher.authorizeChannel(socketId, channel));
  }

  // Agent status channel — any authenticated visitor or portal client can subscribe
  if (channel === "private-agent-status") {
    const session = await auth();
    if (session?.user) {
      return NextResponse.json(pusher.authorizeChannel(socketId, channel));
    }

    const visitorToken = req.headers.get("x-visitor-token");
    if (visitorToken) {
      const visitor = await prisma.conversation.findFirst({
        where: { visitorToken },
        select: { id: true },
      });
      if (visitor) {
        return NextResponse.json(pusher.authorizeChannel(socketId, channel));
      }
    }

    const clientSession = await clientAuth();
    if (clientSession?.user) {
      return NextResponse.json(pusher.authorizeChannel(socketId, channel));
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.json({ error: "Unknown channel" }, { status: 403 });
}
