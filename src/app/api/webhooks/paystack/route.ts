import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/paystack";
import { Resend } from "resend";
import { sendPushToAllAdmins } from "@/lib/push";
import { fmtMoney } from "@/lib/format";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";

  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event: string; data: any };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "charge.success") {
    const { reference, metadata } = event.data;
    const invoiceId = metadata?.invoiceId as string | undefined;

    if (invoiceId) {
      try {
        const invoice = await prisma.invoice.update({
          where: { id: invoiceId },
          data: {
            status: "paid",
            paidAt: new Date(),
            paymentRef: reference,
          },
          include: { client: true },
        });

        // Send receipt email
        await resend.emails.send({
          from: "CiroStack <billing@cirostack.com>",
          to: invoice.client.email,
          subject: `Payment confirmed — Invoice ${invoice.number}`,
          html: `
            <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px;">
              <h2>Payment Confirmed</h2>
              <p>Hi ${invoice.client.name ?? "there"},</p>
              <p>We've received your payment of <strong>${fmtMoney(invoice.amount, invoice.currency)}</strong> for invoice <strong>${invoice.number}</strong>.</p>
              <p>Reference: ${reference}</p>
              <p style="margin-top:24px;">Thank you for your business!</p>
              <p>— The CiroStack Team</p>
            </div>
          `,
        }).catch(console.error);

        // Push notification to all admins
        await sendPushToAllAdmins({
          title: "Invoice Paid",
          body: `${invoice.client.name ?? invoice.client.email} paid ${fmtMoney(invoice.amount, invoice.currency)} (${invoice.number})`,
          url: `/admin/invoices`,
        }).catch(console.error);
      } catch (err) {
        console.error("[webhook/paystack charge.success]", err);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
