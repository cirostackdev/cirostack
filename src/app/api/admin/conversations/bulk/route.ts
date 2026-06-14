import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, ids, adminId } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ error: "No IDs provided" }, { status: 400 });

  switch (action) {
    case "close":
      await prisma.conversation.updateMany({ where: { id: { in: ids } }, data: { status: "closed" } });
      break;
    case "assign":
      await prisma.conversation.updateMany({ where: { id: { in: ids } }, data: { assignedToId: adminId || null } });
      break;
    case "delete":
      await prisma.message.deleteMany({ where: { conversationId: { in: ids } } });
      await prisma.internalNote.deleteMany({ where: { conversationId: { in: ids } } });
      await prisma.conversation.deleteMany({ where: { id: { in: ids } } });
      break;
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, affected: ids.length });
}
