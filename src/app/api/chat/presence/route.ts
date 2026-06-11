import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

const HEARTBEAT_TTL_MS = 2 * 60 * 1000;

// POST { online: true }  — admin came online (Pusher connected)
// POST { online: false } — admin went offline (Pusher disconnected)
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminId = (session.user as any).id as string;
  const { online } = await req.json();

  if (online) {
    await prisma.admin.update({
      where: { id: adminId },
      data: { lastHeartbeat: new Date() },
    });
    await pusher.trigger("private-agent-status", "agent-online", { online: true });
  } else {
    // Check if any other admin is still online
    const cutoff = new Date(Date.now() - HEARTBEAT_TTL_MS);
    const otherOnline = await prisma.admin.findFirst({
      where: {
        id: { not: adminId },
        disabled: false,
        lastHeartbeat: { gte: cutoff },
      },
      select: { id: true },
    });

    if (!otherOnline) {
      await pusher.trigger("private-agent-status", "agent-offline", { online: false });
    }
  }

  return NextResponse.json({ ok: true });
}
