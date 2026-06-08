import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";
import { verifyTransaction } from "@/lib/paystack";
import { fetchUsdToNgn } from "@/lib/exchange-rate";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = (session.user as any).id as string;
  const { id } = await params;
  const body = await req.json();

  const invoice = await prisma.invoice.findFirst({
    where: { id, clientId },
    include: { client: { select: { email: true } } },
  });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (invoice.status === "paid") return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });

  // Action: verify — called after payment to mark invoice paid
  if (body.reference) {
    try {
      const result = await verifyTransaction(body.reference);
      if (!result.status || result.data?.status !== "success") {
        return NextResponse.json({ error: "Payment verification failed" }, { status: 402 });
      }
      await prisma.invoice.update({
        where: { id },
        data: { status: "paid", paidAt: new Date(), paymentRef: body.reference },
      });
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("[POST /api/portal/invoices/[id]/pay] verify error", err);
      return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
    }
  }

  // Action: initialize — compute NGN kobo amount for PaystackPop
  try {
    const usdToNgn = await fetchUsdToNgn();
    // invoice.amount is in USD cents; convert to NGN kobo: (cents / 100) * rate * 100 = cents * rate
    const ngnKobo = Math.round(invoice.amount * usdToNgn);
    const reference = `inv_${id}_${Date.now()}`;

    return NextResponse.json({ ngnKobo, reference });
  } catch (err) {
    console.error("[POST /api/portal/invoices/[id]/pay] init error", err);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}
