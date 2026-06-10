import { NextResponse } from "next/server";
import { clientAuth } from "@/auth-client";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;
  const now = new Date().toISOString();

  // Merge visitorLastSeen into metadata for all open conversations owned by this client
  await prisma.$executeRaw`
    UPDATE "Conversation"
    SET metadata = COALESCE(metadata, '{}') || ${`{"visitorLastSeen":"${now}"}`}::jsonb
    WHERE "visitorId" = ${clientId} AND status = 'open'
  `;

  return NextResponse.json({ ok: true });
}
