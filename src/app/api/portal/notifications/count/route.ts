import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";

export async function GET() {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;

  const unread = await prisma.notification.count({
    where: { clientId, read: false },
  });

  return NextResponse.json({ unread });
}
