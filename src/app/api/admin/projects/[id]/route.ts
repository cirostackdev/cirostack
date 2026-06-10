import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createNotification } from "@/lib/notify";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        milestones: { orderBy: { order: "asc" } },
        updates: { orderBy: { createdAt: "desc" } },
        files: { orderBy: { createdAt: "desc" } },
        invoices: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (err) {
    console.error("[GET /api/admin/projects/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { milestones, startDate, dueDate, ...rest } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
        ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
      },
      include: { client: true },
    });

    if (Array.isArray(milestones)) {
      for (const m of milestones) {
        if (m.id && m.completed !== undefined) {
          const current = await prisma.milestone.findUnique({ where: { id: m.id } });
          const justCompleted = !current?.completed && m.completed;

          await prisma.milestone.update({
            where: { id: m.id },
            data: { completed: m.completed, completedAt: m.completed ? new Date() : null },
          });

          if (justCompleted) {
            createNotification(
              project.clientId,
              "Milestone completed",
              `"${current?.title}" has been marked complete on ${project.title}`,
              `/portal/projects/${id}`
            ).catch(console.error);
          }
        }
      }
    }

    return NextResponse.json(project);
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[PATCH /api/admin/projects/[id]]", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[DELETE /api/admin/projects/[id]]", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
