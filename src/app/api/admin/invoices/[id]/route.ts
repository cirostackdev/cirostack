import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, email: true, name: true, company: true } },
        project: { select: { id: true, title: true } },
      },
    });
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(invoice);
  } catch (err) {
    console.error("[GET /api/admin/invoices/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { dueDate, paidAt, ...rest } = body;
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...rest,
        ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
        ...(paidAt !== undefined ? { paidAt: paidAt ? new Date(paidAt) : null } : {}),
      },
    });
    return NextResponse.json(invoice);
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[PATCH /api/admin/invoices/[id]]", err);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    console.error("[DELETE /api/admin/invoices/[id]]", err);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
