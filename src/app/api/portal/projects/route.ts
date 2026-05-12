import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";

export async function GET() {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;

  try {
    const projects = await prisma.project.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      include: {
        milestones: { orderBy: { order: "asc" } },
        _count: { select: { updates: true, files: true, invoices: true } },
      },
    });
    return NextResponse.json(projects);
  } catch (err) {
    console.error("[GET /api/portal/projects]", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
