import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { tagId } = await req.json();

  await prisma.conversation.update({
    where: { id },
    data: { tags: { connect: { id: tagId } } },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { tagId } = await req.json();

  await prisma.conversation.update({
    where: { id },
    data: { tags: { disconnect: { id: tagId } } },
  });

  return NextResponse.json({ ok: true });
}
