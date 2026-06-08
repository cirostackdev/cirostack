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
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /><style>@media (prefers-color-scheme:dark){.logo-img{background-color:#0f172a !important;border-radius:6px;}}[data-ogsc] .logo-img{background-color:#0f172a !important;border-radius:6px;}</style></head>
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:0;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;">

                  <!-- Header -->
                  <tr>
                    <td style="background:#0f172a;border-radius:12px 12px 0 0;padding:24px 32px;">
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
    <p style="margin:0;font-size:18px;font-weight:600;color:#94a3b8;font-family:'Bricolage Grotesque','Sora',sans-serif;">Client Portal</p>
  </td>
</tr></table>
</td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="background:#ffffff;padding:40px 32px;">
                      <h1 style="margin:0 0 8px 0;font-size:24px;font-weight:700;color:#0f172a;line-height:1.3;">
                        Your client portal is ready
                      </h1>
                      <p style="margin:0 0 24px 0;font-size:15px;color:#64748b;line-height:1.6;">
                        ${client.name ? `Hi ${client.name},` : "Hi there,"}
                      </p>
                      <p style="margin:0 0 20px 0;font-size:15px;color:#334155;line-height:1.7;">
                        We've set up a dedicated portal for you on CiroStack. It's your central hub for everything related to your project:
                      </p>
                      <table cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;width:100%;">
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-right:12px;font-size:18px;">&#128202;</td>
                                <td style="font-size:14px;color:#334155;line-height:1.5;"><strong style="color:#0f172a;">Project tracking</strong> - follow progress in real time</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-right:12px;font-size:18px;">&#128196;</td>
                                <td style="font-size:14px;color:#334155;line-height:1.5;"><strong style="color:#0f172a;">Invoices</strong> - view and download your billing history</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-right:12px;font-size:18px;">&#128229;</td>
                                <td style="font-size:14px;color:#334155;line-height:1.5;"><strong style="color:#0f172a;">Deliverables</strong> - download files and completed work</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <a href="${portalUrl}/portal/login" style="display:inline-block;background:#0f172a;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:-0.2px;">
                              Access Your Portal
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:28px 0 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
                        Sign in using your email address (${client.email}). We'll send a one-time login code to your inbox each time you access the portal - no password needed.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f8fafc;border-radius:0 0 12px 12px;padding:20px 32px;border-top:1px solid #e2e8f0;">
                      <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                        CiroStack | <a href="https://cirostack.com" style="color:#94a3b8;text-decoration:none;">cirostack.com</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/clients/[id]/invite]", err);
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 });
  }
}
