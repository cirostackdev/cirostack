import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoices = await prisma.invoice.findMany({
    include: { client: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const header = "Number,Client,Email,Amount,Currency,Status,Due Date,Paid At,Created\n";
  const rows = invoices.map((inv) =>
    `"${inv.number}","${inv.client.name || ""}","${inv.client.email}",${inv.amount},"${inv.currency}","${inv.status}","${inv.dueDate?.toISOString() || ""}","${inv.paidAt?.toISOString() || ""}","${inv.createdAt.toISOString()}"`
  ).join("\n");

  return new NextResponse(header + rows, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=invoices.csv" } });
}
