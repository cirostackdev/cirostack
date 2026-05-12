import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOnline } from "@/lib/chat-state";

// 2-minute window — any admin whose heartbeat arrived within this threshold is "online"
const HEARTBEAT_TTL_MS = 2 * 60 * 1000;

export async function GET() {
  // Prefer socket-based count (local dev with custom server)
  if (isOnline()) {
    return NextResponse.json({ online: true });
  }

  // Fallback: DB heartbeat (works on Vercel / serverless)
  const cutoff = new Date(Date.now() - HEARTBEAT_TTL_MS);
  const activeAdmin = await prisma.admin.findFirst({
    where: {
      disabled: false,
      lastHeartbeat: { gte: cutoff },
    },
    select: { id: true },
  });

  return NextResponse.json({ online: !!activeAdmin });
}
