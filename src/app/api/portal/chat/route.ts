import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";

// GET — fetch the client's most recent open conversation + messages
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
