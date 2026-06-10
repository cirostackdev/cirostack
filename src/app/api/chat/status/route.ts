import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 2-minute window — any admin whose heartbeat arrived within this threshold is "online"
const HEARTBEAT_TTL_MS = 2 * 60 * 1000;

export async function GET() {
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
