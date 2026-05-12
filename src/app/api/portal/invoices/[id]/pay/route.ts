import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";
import { initializeTransaction } from "@/lib/paystack";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;
  const { id } = await params;

  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id, clientId },
      include: { client: { select: { email: true } } },
    });
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (invoice.status === "paid") return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });

    const portalUrl = process.env.PORTAL_URL ?? "http://localhost:3000";
    const result = await initializeTransaction({
      email: invoice.client.email,
      amount: invoice.amount,
      currency: invoice.currency,
      callback_url: `${portalUrl}/portal/invoices/${id}/success`,
      metadata: { invoiceId: id, invoiceNumber: invoice.number },
    });

    if (!result.status) {
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 502 });
    }

    return NextResponse.json({ authorization_url: result.data.authorization_url });
  } catch (err) {
    console.error("[POST /api/portal/invoices/[id]/pay]", err);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}
