import { NextRequest, NextResponse } from "next/server";
import { clientAuth } from "@/auth-client";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;

  const members = await prisma.clientTeamMember.findMany({
    where: { clientId },
    orderBy: { invitedAt: "desc" },
  });

  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;

  const { email, name, role } = await req.json();
  if (!email?.trim()) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const existing = await prisma.clientTeamMember.findUnique({ where: { clientId_email: { clientId, email: email.trim() } } });
  if (existing) return NextResponse.json({ error: "Member already exists" }, { status: 409 });

  const member = await prisma.clientTeamMember.create({
    data: { clientId, email: email.trim(), name: name?.trim() || null, role: role || "viewer" },
  });

  return NextResponse.json(member, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;

  const { memberId } = await req.json();
  await prisma.clientTeamMember.delete({ where: { id: memberId, clientId } });

  return NextResponse.json({ ok: true });
}
