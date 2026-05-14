import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";

// GET — active open conversation + messages (used for polling)
export async function GET() {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;

  try {
    const conversation = await prisma.conversation.findFirst({
      where: { visitorId: clientId, status: "open" },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        assignedTo: { select: { name: true } },
      },
    });

    return NextResponse.json({ conversation: conversation ?? null });
  } catch (err) {
    console.error("[GET /api/portal/chat]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// PUT — send a message (creates conversation if none exists)
export async function PUT(req: Request) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;

  try {
    const { body, conversationId } = await req.json();
    if (!body?.trim()) return NextResponse.json({ error: "body required" }, { status: 400 });

    // Get client info for the conversation
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { name: true, email: true },
    });

    let convId = conversationId as string | undefined;

    // Find or create open conversation
    if (!convId) {
      const existing = await prisma.conversation.findFirst({
        where: { visitorId: clientId, status: "open" },
        orderBy: { updatedAt: "desc" },
        select: { id: true },
      });

      if (existing) {
        convId = existing.id;
      } else {
        const conv = await prisma.conversation.create({
          data: {
            visitorId: clientId,
            visitorName: client?.name ?? null,
            visitorEmail: client?.email ?? null,
            topic: "Portal message",
          },
        });
        convId = conv.id;
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId: convId,
        senderType: "visitor",
        senderName: client?.name ?? null,
        body: body.trim(),
        read: false,
      },
    });

    // Touch conversation updatedAt
    await prisma.conversation.update({
      where: { id: convId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ message, conversationId: convId });
  } catch (err) {
    console.error("[PUT /api/portal/chat]", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// POST — fetch ALL past conversations for history view
export async function POST() {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;

  try {
    const conversations = await prisma.conversation.findMany({
      where: { visitorId: clientId },
      orderBy: { updatedAt: "desc" },
      take: 20,
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        assignedTo: { select: { name: true } },
      },
    });

    return NextResponse.json({ conversations });
  } catch (err) {
    console.error("[POST /api/portal/chat]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
