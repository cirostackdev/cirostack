import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const project = await prisma.project.findUnique({ where: { id }, select: { id: true } });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large (max 50 MB)" }, { status: 413 });

    const blob = await put(`projects/${id}/${Date.now()}-${file.name}`, file, {
      access: "public",
      contentType: file.type,
    });

    const projectFile = await prisma.projectFile.create({
      data: {
        projectId: id,
        name: file.name,
        url: blob.url,
        size: file.size,
        uploadedBy: (session.user as any).id,
      },
    });

    return NextResponse.json(projectFile, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/projects/[id]/files]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
