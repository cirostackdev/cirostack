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
          subject: `Payment confirmed: Invoice ${invoice.number}`,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#16a34a;padding:28px 32px;">
            <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr>
  <td style="padding-right:10px;vertical-align:middle;">
    <img src="https://cirostack.com/favicon.png" alt="CiroStack" width="28" height="28" style="display:block;border-radius:6px;" />
  </td>
  <td style="vertical-align:middle;padding-right:14px;">
    <p style="margin:0;font-size:15px;font-weight:700;color:#ffffff;">CiroStack</p>
  </td>
  <td style="vertical-align:middle;border-left:1px solid rgba(255,255,255,0.3);padding-left:14px;">
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);">Receipt</p>
  </td>
</tr></table>
            <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Payment Confirmed</p>
            <p style="margin:4px 0 0;font-size:13px;color:#bbf7d0;">Your payment was received successfully.</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 24px;font-size:15px;color:#1e293b;line-height:1.6;">
              Hi ${invoice.client.name ?? "there"}, thank you for your payment. Here is your receipt.
            </p>

            <!-- Receipt details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:8px;padding:20px;margin-bottom:24px;">
              <tr>
                <td style="padding:6px 0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#64748b;width:40%;">Invoice</td>
                      <td style="font-size:13px;color:#1e293b;font-weight:600;">${invoice.number}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#64748b;padding-top:8px;">Amount paid</td>
                      <td style="font-size:15px;color:#16a34a;font-weight:700;padding-top:8px;">${fmtMoney(invoice.amount, invoice.currency)}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#64748b;padding-top:8px;">Date</td>
                      <td style="font-size:13px;color:#1e293b;padding-top:8px;">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#64748b;padding-top:8px;">Reference</td>
                      <td style="font-size:12px;color:#475569;font-family:monospace;padding-top:8px;">${reference}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
              Keep this email as your receipt. You can also view and download a PDF copy from your client portal.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">CiroStack | cirostack.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
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
