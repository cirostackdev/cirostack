import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/paystack";
import { sendPush } from "@/lib/push";
import { createNotification } from "@/lib/notify";

export async function POST(req: Request) {
  const signature = req.headers.get("x-paystack-signature") ?? "";
  const rawBody = await req.text();

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "charge.success") {
    const { reference, metadata } = event.data ?? {};
    const invoiceId = metadata?.invoiceId as string | undefined;

    if (invoiceId) {
      try {
        // Only update if not already paid — guards against webhook retries and
        // race with inline verify path
        const updated = await prisma.invoice.updateMany({
          where: { id: invoiceId, status: { not: "paid" } },
          data: { status: "paid", paidAt: new Date(), paymentRef: reference ?? null },
        });

        if (updated.count === 0) {
          // Already marked paid (inline verify beat the webhook) — skip notifications
          return NextResponse.json({ received: true });
        }

        const invoice = await prisma.invoice.findUnique({
          where: { id: invoiceId },
          select: { clientId: true, number: true },
        });
        if (invoice) {
          sendPush("client", invoice.clientId, {
            title: "Payment confirmed",
            body: `Invoice ${invoice.number} has been marked as paid.`,
            url: `/portal/invoices/${invoiceId}`,
          }).catch(console.error);
          createNotification(invoice.clientId, "Payment confirmed", `Invoice ${invoice.number} has been marked as paid.`, `/portal/invoices/${invoiceId}`).catch(console.error);
        }
      } catch (err) {
        console.error("[Paystack webhook] Failed to update invoice:", err);
        return NextResponse.json({ error: "DB error" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
