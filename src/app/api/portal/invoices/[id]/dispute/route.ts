import { NextRequest, NextResponse } from "next/server";
import { clientAuth } from "@/auth-client";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;
  const { id } = await params;

  const { reason } = await req.json();
  if (!reason?.trim()) return NextResponse.json({ error: "Reason required" }, { status: 400 });

  // Verify invoice belongs to client
  const invoice = await prisma.invoice.findFirst({ where: { id, clientId } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  // Check if dispute already exists
  const existing = await prisma.invoiceDispute.findFirst({ where: { invoiceId: id, clientId, status: { not: "resolved" } } });
  if (existing) return NextResponse.json({ error: "Active dispute already exists" }, { status: 409 });

  const dispute = await prisma.invoiceDispute.create({
    data: { invoiceId: id, clientId, reason: reason.trim() },
  });

  return NextResponse.json(dispute, { status: 201 });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;
  const { id } = await params;

  const disputes = await prisma.invoiceDispute.findMany({
    where: { invoiceId: id, clientId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(disputes);
}
