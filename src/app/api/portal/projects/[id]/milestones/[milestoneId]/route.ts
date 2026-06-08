import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";

type Params = { params: Promise<{ id: string; milestoneId: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;
  const { id, milestoneId } = await params;

  try {
    // Verify the milestone belongs to a project owned by this client
    const milestone = await prisma.milestone.findFirst({
      where: { id: milestoneId, project: { id, clientId } },
    });
    if (!milestone) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { completed } = await req.json();
    const updated = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        ...(completed !== undefined
          ? { completed, completedAt: completed ? new Date() : null }
          : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[PATCH /api/portal/projects/[id]/milestones/[milestoneId]]", err);
    return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 });
  }
}
