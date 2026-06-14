import { NextRequest, NextResponse } from "next/server";
import { clientAuth } from "@/auth-client";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;
  const { id } = await params;

  // Verify project belongs to client
  const project = await prisma.project.findFirst({ where: { id, clientId } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const { name, url, size } = await req.json();
  if (!name || !url) return NextResponse.json({ error: "Name and URL required" }, { status: 400 });

  const file = await prisma.projectFile.create({
    data: { projectId: id, name, url, size: size || null, uploadedBy: "client" },
  });

  return NextResponse.json(file, { status: 201 });
}
