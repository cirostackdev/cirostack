import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const disputes = await prisma.invoiceDispute.findMany({
    where: { invoiceId: id },
    include: { client: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(disputes);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const { disputeId, status, adminNote } = await req.json();

  const dispute = await prisma.invoiceDispute.update({
    where: { id: disputeId },
    data: { status, adminNote },
  });

  return NextResponse.json(dispute);
}
