import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tags = await prisma.conversationTag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { conversations: true } } },
  });

  return NextResponse.json(tags);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, color } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const tag = await prisma.conversationTag.create({
    data: { name: name.trim(), color: color || "#6366f1" },
  });

  return NextResponse.json(tag, { status: 201 });
}
