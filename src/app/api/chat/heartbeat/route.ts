import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminId = (session.user as any).id as string;

  await prisma.admin.update({
    where: { id: adminId },
    data: { lastHeartbeat: new Date() },
  });

  return NextResponse.json({ ok: true });
}
