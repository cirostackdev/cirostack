import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoices = await prisma.invoice.findMany({
    where: { status: "paid" },
    include: { client: { select: { name: true, email: true } } },
    orderBy: { paidAt: "desc" },
  });

  const header = "Invoice,Client,Amount (cents),Currency,USD Rate,USD Amount,Paid Date\n";
  const rows = invoices.map((inv) => {
    const usd = (inv.amount / 100 / inv.usdRate).toFixed(2);
    return `"${inv.number}","${inv.client.name || inv.client.email}",${inv.amount},"${inv.currency}",${inv.usdRate},${usd},"${inv.paidAt?.toISOString() || ""}"`;
  }).join("\n");

  return new NextResponse(header + rows, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=revenue.csv" } });
}
