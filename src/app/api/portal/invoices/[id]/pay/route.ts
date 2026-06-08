import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";
import { initializeTransaction, verifyTransaction } from "@/lib/paystack";
import { fetchUsdToNgn } from "@/lib/exchange-rate";
import { sendPush } from "@/lib/push";
import { createNotification } from "@/lib/notify";

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
      // Notify client — webhook will deduplicate on its side
      sendPush("client", clientId, {
        title: "Payment confirmed",
        body: `Invoice ${invoice.number} has been marked as paid.`,
        url: `/portal/invoices/${id}`,
      }).catch(console.error);
      createNotification(clientId, "Payment confirmed", `Invoice ${invoice.number} has been marked as paid.`, `/portal/invoices/${id}`).catch(console.error);
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("[POST /api/portal/invoices/[id]/pay] verify error", err);
      return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
    }
  }

  // Action: initialize — get authorization_url from Paystack
  try {
    const usdToNgn = await fetchUsdToNgn();
    const ngnKobo = Math.round(invoice.amount * usdToNgn);
    const portalUrl = process.env.PORTAL_URL ?? "http://localhost:3000";

    const result = await initializeTransaction({
      email: invoice.client.email,
      amount: ngnKobo,
      currency: "NGN",
      reference: `${id}-${Date.now()}`,
      callback_url: `${portalUrl}/portal/payment-callback?invoiceId=${id}`,
      metadata: { invoiceId: id, invoiceNumber: invoice.number },
    });

    if (!result.status) {
      console.error("[Paystack init error]", result);
      return NextResponse.json({ error: result.message || "Failed to initialize payment" }, { status: 502 });
    }

    return NextResponse.json({ authorization_url: result.data.authorization_url });
  } catch (err) {
    console.error("[POST /api/portal/invoices/[id]/pay] init error", err);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}
