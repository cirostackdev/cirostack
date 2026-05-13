import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { title, dueDate } = await req.json();
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    const last = await prisma.milestone.findFirst({
      where: { projectId: id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const milestone = await prisma.milestone.create({
      data: {
        projectId: id,
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        order: (last?.order ?? -1) + 1,
      },
    });
    return NextResponse.json(milestone, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/projects/[id]/milestones]", err);
    return NextResponse.json({ error: "Failed to create milestone" }, { status: 500 });
  }
}
