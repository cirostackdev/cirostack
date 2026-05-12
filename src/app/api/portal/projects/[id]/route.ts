import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;
  const { id } = await params;

  try {
    const project = await prisma.project.findFirst({
      where: { id, clientId },
      include: {
        milestones: { orderBy: { order: "asc" } },
        updates: {
          where: { internal: false },
          orderBy: { createdAt: "desc" },
        },
        files: { orderBy: { createdAt: "desc" } },
        invoices: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (err) {
    console.error("[GET /api/portal/projects/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
