import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; msgId: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, msgId } = await params;

  const message = await prisma.message.findFirst({
    where: { id: msgId, conversationId: id },
    select: { id: true },
  });

  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.message.delete({ where: { id: msgId } });

  return NextResponse.json({ ok: true });
}
