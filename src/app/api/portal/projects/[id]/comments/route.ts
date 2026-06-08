import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;
  const { id } = await params;

  const project = await prisma.project.findFirst({ where: { id, clientId } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const comments = await prisma.projectComment.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(comments);
}

export async function POST(req: Request, { params }: Params) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;
  const { id } = await params;

  const project = await prisma.project.findFirst({ where: { id, clientId } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Body required" }, { status: 400 });

  const comment = await prisma.projectComment.create({
    data: { projectId: id, clientId, body: body.trim() },
  });
  return NextResponse.json(comment, { status: 201 });
}
