import { NextResponse } from "next/server";
import { clientAuth } from "@/auth-client";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

export async function POST(req: Request) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;
  const { online } = await req.json().catch(() => ({ online: true }));
  const isOnline = online !== false;
  const now = new Date().toISOString();

  // Get all open conversations for this client
  const conversations = await prisma.conversation.findMany({
    where: { visitorId: clientId, status: "open" },
    select: { id: true, metadata: true },
  });

  if (conversations.length === 0) return NextResponse.json({ ok: true });

  // Update DB presence timestamp (only when going online)
  if (isOnline) {
    await prisma.$executeRaw`
      UPDATE "Conversation"
      SET metadata = COALESCE(metadata, '{}') || ${`{"visitorLastSeen":"${now}"}`}::jsonb
      WHERE "visitorId" = ${clientId} AND status = 'open'
    `;
  }

  // Push visitor-presence to all open conversation channels
  await Promise.all(
    conversations.map((conv) =>
      pusher.trigger(`private-conversation-${conv.id}`, "visitor-presence", { online: isOnline })
    )
  );

  return NextResponse.json({ ok: true });
}
