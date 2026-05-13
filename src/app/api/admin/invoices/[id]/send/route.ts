import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Resend } from "resend";

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
    const amount = `${invoice.currency} ${(invoice.amount / 100).toFixed(2)}`;

    await resend.emails.send({
      from: "CiroStack <noreply@cirostack.com>",
      to: invoice.client.email,
      subject: `Invoice ${invoice.number} — ${amount}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2 style="margin-bottom:8px;">Invoice ${invoice.number}</h2>
          <p style="color:#555;margin-bottom:8px;">
            ${invoice.client.name ? `Hi ${invoice.client.name},` : "Hi,"}<br/><br/>
            A new invoice has been issued${invoice.project ? ` for <strong>${invoice.project.title}</strong>` : ""}.
          </p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="padding:8px 0;color:#999;">Amount</td><td style="padding:8px 0;font-weight:bold;">${amount}</td></tr>
            ${invoice.dueDate ? `<tr><td style="padding:8px 0;color:#999;">Due</td><td style="padding:8px 0;">${new Date(invoice.dueDate).toLocaleDateString()}</td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#999;">Status</td><td style="padding:8px 0;text-transform:capitalize;">${invoice.status}</td></tr>
          </table>
          <a href="${portalUrl}/portal/invoices/${id}" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            View &amp; Pay Invoice
          </a>
          <p style="color:#999;font-size:12px;margin-top:24px;">
            You can also download a PDF copy from your client portal.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/invoices/[id]/send]", err);
    return NextResponse.json({ error: "Failed to send invoice" }, { status: 500 });
  }
}
