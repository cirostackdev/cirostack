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
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const portalUrl = process.env.PORTAL_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    await resend.emails.send({
      from: "CiroStack <noreply@cirostack.com>",
      to: client.email,
      subject: "You've been invited to the CiroStack Client Portal",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2 style="margin-bottom:8px;">Welcome to your Client Portal</h2>
          <p style="color:#555;margin-bottom:24px;">
            ${client.name ? `Hi ${client.name},` : "Hi,"}<br/><br/>
            Your account has been set up on the CiroStack Client Portal. You can track your projects,
            view invoices, and download deliverables — all in one place.
          </p>
          <a href="${portalUrl}/portal/login" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            Access your Portal
          </a>
          <p style="color:#999;font-size:12px;margin-top:24px;">
            Sign in with your email address (${client.email}) using a one-time code sent to your inbox.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/clients/[id]/invite]", err);
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 });
  }
}
