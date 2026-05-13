import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { params: Promise<{ id: string; fileId: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { fileId } = await params;
  try {
    await prisma.projectFile.delete({ where: { id: fileId } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[DELETE /api/admin/projects/[id]/files/[fileId]]", err);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
