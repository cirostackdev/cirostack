import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";

export async function GET() {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;

  try {
    const invoices = await prisma.invoice.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      include: { project: { select: { title: true } } },
    });
    return NextResponse.json(invoices);
  } catch (err) {
    console.error("[GET /api/portal/invoices]", err);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
