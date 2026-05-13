import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { params: Promise<{ id: string; milestoneId: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { milestoneId } = await params;
  try {
    const { title, dueDate, completed } = await req.json();
    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
        ...(completed !== undefined ? { completed, completedAt: completed ? new Date() : null } : {}),
      },
    });
    return NextResponse.json(milestone);
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[PATCH /api/admin/projects/[id]/milestones/[milestoneId]]", err);
    return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { milestoneId } = await params;
  try {
    await prisma.milestone.delete({ where: { id: milestoneId } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[DELETE /api/admin/projects/[id]/milestones/[milestoneId]]", err);
    return NextResponse.json({ error: "Failed to delete milestone" }, { status: 500 });
  }
}
