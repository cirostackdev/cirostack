import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { params: Promise<{ id: string; updateId: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { updateId } = await params;
  try {
    await prisma.projectUpdate.delete({ where: { id: updateId } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[DELETE /api/admin/projects/[id]/updates/[updateId]]", err);
    return NextResponse.json({ error: "Failed to delete update" }, { status: 500 });
  }
}
