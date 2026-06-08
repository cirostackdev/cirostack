import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "contact@cirostack.com";
const FROM = "CiroStack Forms <forms@cirostack.com>";

export async function POST(req: Request) {
  try {
    const { name, company, email, phone, service, budget, timeline, description } = await req.json();

    if (!name || !email || !service || !description) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    prisma.formSubmission.create({ data: { type: "start", data: { name, company, email, phone, service, budget, timeline, description } } }).catch(console.error);
    prisma.lead.upsert({ where: { email }, update: { name, source: "start-project" }, create: { email, name, source: "start-project", tags: ["project-brief"] } }).catch(console.error);

    // Push notification to all admins
    import("@/lib/push").then(({ sendPushToAllAdmins }) =>
      sendPushToAllAdmins({ title: "New Project Brief", body: `${name}${company ? ` (${company})` : ""} submitted a project brief`, url: "/admin/submissions" })
    ).catch(console.error);

    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `New Project Brief: ${name}${company ? ` (${company})` : ""}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /></head>
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;">

                  <!-- Header -->
                  <tr>
                    <td style="background:#0f172a;border-radius:10px 10px 0 0;padding:24px 32px;">
  <table cellpadding="0" cellspacing="0"><tr>
    <td style="padding-right:10px;vertical-align:middle;">
      <img src="https://cirostack.com/favicon.png" alt="CiroStack" width="28" height="28" style="display:block;border-radius:6px;" />
    </td>
    <td style="vertical-align:middle;padding-right:14px;">
      <p style="margin:0;font-size:15px;font-weight:700;color:#ffffff;"><span style="color:#ffffff;">Ciro</span><span style="color:#e03333;">Stack</span</p>
    </td>
    <td style="vertical-align:middle;border-left:1px solid #334155;padding-left:14px;">
      <p style="margin:0;font-size:13px;color:#94a3b8;">Project Brief</p>
    </td>
  </tr></table>
</td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="background:#ffffff;padding:28px 28px 24px 28px;">
                      <h2 style="margin:0 0 4px 0;font-size:18px;font-weight:700;color:#0f172a;">New Project Brief</h2>
                      <p style="margin:0 0 20px 0;font-size:13px;color:#64748b;">Submitted via cirostack.com/contact/start</p>

                      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
                        <tr>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;width:150px;">Name</td>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;">${name}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Email</td>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;"><a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;">${email}</a></td>
                        </tr>
                        ${company ? `
                        <tr>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Company</td>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;">${company}</td>
                        </tr>` : ""}
                        ${phone ? `
                        <tr>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Phone</td>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${phone}</td>
                        </tr>` : ""}
                        <tr>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Service</td>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;">${service}</td>
                        </tr>
                        ${budget ? `
                        <tr>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Budget</td>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${budget}</td>
                        </tr>` : ""}
                        ${timeline ? `
                        <tr>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Timeline</td>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;">${timeline}</td>
                        </tr>` : ""}
                      </table>

                      <h3 style="margin:24px 0 8px 0;font-size:14px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.05em;">Project Description</h3>
                      <div style="background:#f8fafc;border-left:3px solid #0f172a;padding:16px;border-radius:0 6px 6px 0;">
                        <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;white-space:pre-wrap;">${description}</p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f8fafc;border-radius:0 0 10px 10px;padding:16px 28px;border-top:1px solid #e2e8f0;">
                      <p style="margin:0;font-size:12px;color:#94a3b8;">
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
    console.error("[api/contact/start]", err);
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }
}
