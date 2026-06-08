import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalPaid, thisMonthPaid, lastMonthPaid, outstanding, paidInvoices] = await Promise.all([
      prisma.invoice.aggregate({
        where: { status: "paid" },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { status: "paid", paidAt: { gte: thisMonthStart } },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { status: "paid", paidAt: { gte: lastMonthStart, lt: thisMonthStart } },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { status: { in: ["unpaid", "overdue"] } },
        _sum: { amount: true },
      }),
      prisma.invoice.findMany({
        where: { status: "paid", paidAt: { not: null } },
        orderBy: { paidAt: "desc" },
        include: { client: { select: { name: true, email: true } } },
      }),
    ]);

    // Build monthly data for last 12 months
    const monthly: { month: number; year: number; label: string; total: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const monthPayments = paidInvoices.filter((inv) => {
        const paid = inv.paidAt ? new Date(inv.paidAt) : null;
        return paid && paid >= d && paid < monthEnd;
      });
      const total = monthPayments.reduce((s, inv) => s + inv.amount, 0);
      monthly.push({
        month: d.getMonth(),
        year: d.getFullYear(),
        label: d.toLocaleString("en-US", { month: "short" }),
        total,
      });
    }

    return NextResponse.json({
      summary: {
        totalRevenue: totalPaid._sum.amount ?? 0,
        thisMonth: thisMonthPaid._sum.amount ?? 0,
        lastMonth: lastMonthPaid._sum.amount ?? 0,
        outstanding: outstanding._sum.amount ?? 0,
      },
      monthly,
      payments: paidInvoices.map((inv) => ({
        id: inv.id,
        number: inv.number,
        amount: inv.amount,
        currency: inv.currency,
        paidAt: inv.paidAt,
        client: inv.client,
      })),
    });
  } catch (err) {
    console.error("[GET /api/admin/revenue]", err);
    return NextResponse.json({ error: "Failed to fetch revenue data" }, { status: 500 });
  }
}
