import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";
import { verifyTransaction } from "@/lib/paystack";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;
  const { id } = await params;

  try {
    const { reference } = await req.json();
    if (!reference) return NextResponse.json({ error: "Reference required" }, { status: 400 });

    const invoice = await prisma.invoice.findFirst({
      where: { id, clientId },
    });
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (invoice.status === "paid") return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });

    // Verify with Paystack
    const result = await verifyTransaction(reference);
    if (!result.status || result.data?.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 402 });
    }

    // Confirm amount matches
    if (result.data.amount !== invoice.amount) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // Mark as paid
    await prisma.invoice.update({
      where: { id },
      data: {
        status: "paid",
        paidAt: new Date(),
        paymentRef: reference,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/portal/invoices/[id]/pay]", err);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
