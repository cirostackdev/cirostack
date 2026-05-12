import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { email: true, name: true, company: true } },
        milestones: { orderBy: { order: "asc" } },
        _count: { select: { updates: true, files: true, invoices: true } },
      },
    });
    return NextResponse.json(projects);
  } catch (err) {
    console.error("[GET /api/admin/projects]", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { clientId, title, description, status, startDate, dueDate } = await req.json();
    if (!clientId || !title) return NextResponse.json({ error: "clientId and title required" }, { status: 400 });

    const project = await prisma.project.create({
      data: {
        clientId,
        title,
        description,
        status: status ?? "discovery",
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/projects]", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
