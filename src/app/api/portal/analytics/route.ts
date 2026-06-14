import { NextResponse } from "next/server";
import { clientAuth } from "@/auth-client";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;

  // Monthly spend (last 12 months)
  const invoices = await prisma.invoice.findMany({
    where: { clientId, status: "paid" },
    select: { amount: true, currency: true, usdRate: true, paidAt: true },
    orderBy: { paidAt: "asc" },
  });

  const monthlySpend: { month: string; amount: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const monthInvoices = invoices.filter((inv) => {
      if (!inv.paidAt) return false;
      const p = new Date(inv.paidAt);
      return p.getFullYear() === d.getFullYear() && p.getMonth() === d.getMonth();
    });
    const total = monthInvoices.reduce((sum, inv) => sum + inv.amount / 100 / inv.usdRate, 0);
    monthlySpend.push({ month: key, amount: Math.round(total * 100) / 100 });
  }

  // Project stats
  const projects = await prisma.project.findMany({
    where: { clientId },
    select: { status: true, createdAt: true },
  });

  const projectsByStatus: Record<string, number> = {};
  for (const p of projects) {
    projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1;
  }

  // Total spend
  const totalSpend = invoices.reduce((sum, inv) => sum + inv.amount / 100 / inv.usdRate, 0);

  return NextResponse.json({
    monthlySpend,
    projectsByStatus,
    totalSpend: Math.round(totalSpend * 100) / 100,
    totalProjects: projects.length,
    totalInvoicesPaid: invoices.length,
  });
}
