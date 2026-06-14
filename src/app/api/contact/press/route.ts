import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { escapeHtml } from "@/lib/escape-html";
import { isFormRateLimited } from "@/lib/rate-limit-db";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "cirostack@gmail.com";
const FROM = "CiroStack Forms <forms@cirostack.com>";

export async function POST(req: Request) {
  try {
    const { name, email, organisation, requestType, eventDate, details } = await req.json();

    if (!name || !email || !organisation || !requestType || !details) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (await isFormRateLimited(email, "press")) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }

    prisma.formSubmission.create({ data: { type: "press", data: { name, email, organisation, requestType, eventDate, details } } }).catch(console.error);
    prisma.lead.upsert({ where: { email }, update: { name, source: "press" }, create: { email, name, source: "press", tags: ["press", requestType] } }).catch(console.error);

    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: TO,
        replyTo: email,
        subject: `Press Inquiry: ${name} (${organisation})`,
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
    <p style="margin:0;font-size:18px;font-weight:600;color:#94a3b8;font-family:'Bricolage Grotesque','Sora',sans-serif;">Press Inquiry</p>
  </td>
</tr></table>
</td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="background:#ffffff;padding:28px 28px 24px 28px;">
                      <h2 style="margin:0 0 4px 0;font-size:18px;font-weight:700;color:#0f172a;">New Press and Speaking Request</h2>
                      <p style="margin:0 0 20px 0;font-size:13px;color:#64748b;">Submitted via cirostack.com/contact/press</p>

                      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
                        <tr>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;width:150px;">Name</td>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(name)}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Email</td>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;"><a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;">${escapeHtml(email)}</a></td>
                        </tr>
                        <tr>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Organisation</td>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(organisation)}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Request Type</td>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;">${escapeHtml(requestType)}</td>
                        </tr>
                        ${eventDate ? `
                        <tr>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Event Date</td>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(eventDate)}</td>
                        </tr>` : ""}
                      </table>

                      <h3 style="margin:24px 0 8px 0;font-size:14px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.05em;">Details</h3>
                      <div style="background:#f8fafc;border-left:3px solid #0f172a;padding:16px;border-radius:0 6px 6px 0;">
                        <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;white-space:pre-wrap;">${escapeHtml(details)}</p>
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
      }),
      resend.emails.send({
        from: "CiroStack <noreply@cirostack.com>",
        to: email,
        subject: "We received your press inquiry",
        html: `<!DOCTYPE html>
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
                <p style="margin:0;font-size:18px;font-weight:600;color:#94a3b8;font-family:'Bricolage Grotesque','Sora',sans-serif;">Press Inquiry</p>
              </td>
            </tr></table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px 0;font-size:15px;color:#0f172a;">Hi ${escapeHtml(name)},</p>
            <p style="margin:0 0 24px 0;font-size:15px;color:#334155;line-height:1.6;">Thank you for reaching out. Our team will review your request and respond within two business days.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;background:#f8fafc;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;width:140px;">Organisation</td>
                <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(organisation)}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;${eventDate ? "border-bottom:1px solid #e2e8f0;" : ""}color:#64748b;font-weight:600;">Request type</td>
                <td style="padding:10px 14px;${eventDate ? "border-bottom:1px solid #e2e8f0;" : ""}color:#0f172a;">${escapeHtml(requestType)}</td>
              </tr>
              ${eventDate ? `<tr>
                <td style="padding:10px 14px;color:#64748b;font-weight:600;">Event date</td>
                <td style="padding:10px 14px;color:#0f172a;">${escapeHtml(eventDate)}</td>
              </tr>` : ""}
            </table>
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
</html>`,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact/press]", err);
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }
}
