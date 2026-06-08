import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Resend } from "resend";
import { fmtMoney } from "@/lib/format";

const resend = new Resend(process.env.RESEND_API_KEY);

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { client: true, project: { select: { title: true } } },
    });
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const portalUrl = process.env.PORTAL_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const amount = fmtMoney(invoice.amount, invoice.currency);
    const lineItems = invoice.lineItems as { description: string; amount?: number; qty?: number; unitPrice?: number }[];

    await resend.emails.send({
      from: "CiroStack <billing@cirostack.com>",
      to: invoice.client.email,
      subject: `Invoice ${invoice.number} for ${amount}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&family=Sora:wght@400;500;600&display=swap" rel="stylesheet"><style>@media (prefers-color-scheme:dark){.logo-img{background-color:#0f172a !important;border-radius:6px;}}[data-ogsc] .logo-img{background-color:#0f172a !important;border-radius:6px;}</style></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Sora',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:0;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;">

        <!-- Header -->
        <tr>
          <td style="background:#0f172a;padding:24px 32px;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr>
  <td style="vertical-align:middle;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:10px;vertical-align:middle;">
        <img src="https://cirostack.com/favicon.png" alt="CiroStack" width="28" height="28" class="logo-img" style="display:block;border-radius:6px;" />
      </td>
      <td style="vertical-align:middle;">
        <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;font-family:'Bricolage Grotesque','Sora',sans-serif;"><span style="color:#ffffff;">Ciro</span><span style="color:#e03333;">Stack</span></p>
      </td>
    </tr></table>
  </td>
  <td style="vertical-align:middle;text-align:right;">
    <p style="margin:0;font-size:18px;font-weight:600;color:#94a3b8;font-family:'Bricolage Grotesque','Sora',sans-serif;">Invoice</p>
  </td>
</tr></table>
</td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 6px;font-size:13px;color:#64748b;">Hi ${invoice.client.name ?? "there"},</p>
            <p style="margin:0 0 24px;font-size:15px;color:#1e293b;line-height:1.6;">
              A new invoice has been issued${invoice.project ? ` for <strong>${invoice.project.title}</strong>` : ""}.
              Please review the details below and pay at your earliest convenience.
            </p>

            <!-- Invoice meta -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:20px;margin-bottom:24px;">
              <tr>
                <td style="padding:6px 0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#64748b;width:40%;">Invoice number</td>
                      <td style="font-size:13px;color:#1e293b;font-weight:600;">${invoice.number}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#64748b;padding-top:8px;">Amount due</td>
                      <td style="font-size:15px;color:#1e293b;font-weight:700;padding-top:8px;">${amount}</td>
                    </tr>
                    ${invoice.dueDate ? `
                    <tr>
                      <td style="font-size:13px;color:#64748b;padding-top:8px;">Due date</td>
                      <td style="font-size:13px;color:#1e293b;padding-top:8px;">${new Date(invoice.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
                    </tr>` : ""}
                  </table>
                </td>
              </tr>
            </table>

            <!-- Line items -->
            ${lineItems.length > 0 ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-top:1px solid #e2e8f0;">
              ${lineItems.map((l) => {
                const amt = l.amount != null ? l.amount : (l.qty ?? 1) * (l.unitPrice ?? 0);
                return `<tr>
                  <td style="font-size:13px;color:#475569;padding:10px 0;border-bottom:1px solid #f1f5f9;">${l.description}</td>
                  <td style="font-size:13px;color:#1e293b;font-weight:500;padding:10px 0;border-bottom:1px solid #f1f5f9;text-align:right;">${fmtMoney(amt, invoice.currency)}</td>
                </tr>`;
              }).join("")}
              <tr>
                <td style="font-size:14px;color:#1e293b;font-weight:600;padding:12px 0 0;">Total</td>
                <td style="font-size:15px;color:#1e293b;font-weight:700;padding:12px 0 0;text-align:right;">${amount}</td>
              </tr>
            </table>` : ""}

            <!-- CTA -->
            <a href="${portalUrl}/portal/invoices/${id}" style="display:block;background:#0f172a;color:#ffffff;padding:14px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;text-align:center;margin-bottom:24px;">
              View and Pay Invoice
            </a>

            <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
              You can also download a PDF copy from your client portal. If you have any questions, reply to this email.
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
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/invoices/[id]/send]", err);
    return NextResponse.json({ error: "Failed to send invoice" }, { status: 500 });
  }
}
