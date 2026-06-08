import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendPush } from "@/lib/push";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { email: true, name: true, company: true } },
        project: { select: { title: true } },
      },
    });
    return NextResponse.json(invoices);
  } catch (err) {
    console.error("[GET /api/admin/invoices]", err);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { clientId, projectId, number, amount, currency, dueDate, lineItems } = await req.json();
    if (!clientId || !number || !amount || !lineItems) {
      return NextResponse.json({ error: "clientId, number, amount, lineItems required" }, { status: 400 });
    }

    const cur = "USD";

    const invoice = await prisma.invoice.create({
      data: {
        clientId,
        projectId: projectId ?? null,
        number,
        amount,
        currency: cur,
        dueDate: dueDate ? new Date(dueDate) : null,
        lineItems,
        status: "unpaid",
      },
    });

    // Notify client
    sendPush("client", clientId, {
      title: "New invoice",
      body: `Invoice ${number} for ${cur} ${(amount / 100).toFixed(2)} is ready`,
      url: `/portal/invoices/${invoice.id}`,
    }).catch(console.error);

    return NextResponse.json(invoice, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") return NextResponse.json({ error: "Invoice number already exists" }, { status: 409 });
    console.error("[POST /api/admin/invoices]", err);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
