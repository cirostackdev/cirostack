import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { pusher } from "@/lib/pusher";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { adminId } = await req.json();
    const conversation = await prisma.conversation.update({
      where: { id },
      data: { assignedToId: adminId ?? null },
      include: { assignedTo: { select: { id: true, name: true } } },
    });

    await pusher.trigger("private-admin-notifications", "conversation-assigned", {
      conversationId: id,
      assignedTo: conversation.assignedTo ?? null,
    });

    return NextResponse.json(conversation);
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[POST /api/admin/conversations/[id]/assign]", err);
    return NextResponse.json({ error: "Failed to assign" }, { status: 500 });
  }
}
