import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

const HEARTBEAT_TTL_MS = 2 * 60 * 1000;

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminId = (session.user as any).id as string;

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { lastHeartbeat: true },
  });

  await prisma.admin.update({
    where: { id: adminId },
    data: { lastHeartbeat: new Date() },
  });

  // If admin was offline before this heartbeat, broadcast coming online
  const wasOffline =
    !admin?.lastHeartbeat ||
    Date.now() - new Date(admin.lastHeartbeat).getTime() > HEARTBEAT_TTL_MS;

  if (wasOffline) {
    await pusher.trigger("private-agent-status", "agent-online", { online: true });
  }

  // Always push a tick so clients can reset their offline-detection timeout
  await pusher.trigger("private-agent-status", "agent-heartbeat", { ts: Date.now() });

  return NextResponse.json({ ok: true });
}
