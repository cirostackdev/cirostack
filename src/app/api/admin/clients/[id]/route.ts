import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const client = await prisma.client.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        avatarUrl: true,
        createdAt: true,
        projects: {
          orderBy: { createdAt: "desc" },
          include: { milestones: true, _count: { select: { updates: true, files: true } } },
        },
        invoices: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(client);
  } catch (err) {
    console.error("[GET /api/admin/clients/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { name, company, email } = body;
    const client = await prisma.client.update({ where: { id }, data: { name, company, email } });
    return NextResponse.json(client);
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[PATCH /api/admin/clients/[id]]", err);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[DELETE /api/admin/clients/[id]]", err);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
