import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? "";
const TO = "contact@cirostack.com";
const FROM = "CiroStack Resources <resources@cirostack.com>";

export async function POST(req: Request) {
  try {
    const { email, resourceTitle, resourceType } = await req.json();
    if (!email || !resourceTitle) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    // Add to newsletter audience
    if (AUDIENCE_ID) {
      await resend.contacts.create({ audienceId: AUDIENCE_ID, email, unsubscribed: false });
    }

    prisma.formSubmission.create({ data: { type: "resources", data: { email, resourceTitle, resourceType } } }).catch(console.error);
    prisma.lead.upsert({ where: { email }, update: { source: "resources" }, create: { email, source: "resources", tags: ["resource-download", resourceTitle] } }).catch(console.error);

    // Notify the team
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Resource Request: ${resourceTitle}`,
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
      <p style="margin:0;font-size:15px;font-weight:700;color:#ffffff;font-family:'Bricolage Grotesque','Sora',sans-serif;"><span style="color:#ffffff;">Ciro</span><span style="color:#e03333;">Stack</span</p>
    </td>
    <td style="vertical-align:middle;border-left:1px solid #334155;padding-left:14px;">
      <p style="margin:0;font-size:13px;color:#94a3b8;">Resource Request</p>
    </td>
  </tr></table>
</td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="background:#ffffff;padding:28px 28px 24px 28px;">
                      <h2 style="margin:0 0 4px 0;font-size:18px;font-weight:700;color:#0f172a;">Resource Download Request</h2>
                      <p style="margin:0 0 20px 0;font-size:13px;color:#64748b;">Submitted via cirostack.com/resources - send within 24 hours</p>

                      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
                        <tr>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;width:150px;">Email</td>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;"><a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;">${email}</a></td>
                        </tr>
                        <tr>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Resource</td>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;">${resourceTitle}</td>
                        </tr>
                        ${resourceType ? `
                        <tr>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Type</td>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;">${resourceType}</td>
                        </tr>` : ""}
                      </table>
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

    // Confirm to the requester
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Your resource is on its way: ${resourceTitle}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /></head>
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;">

                  <!-- Header -->
                  <tr>
                    <td style="background:#0f172a;border-radius:12px 12px 0 0;padding:24px 32px;">
  <table cellpadding="0" cellspacing="0"><tr>
    <td style="padding-right:10px;vertical-align:middle;">
      <img src="https://cirostack.com/favicon.png" alt="CiroStack" width="28" height="28" style="display:block;border-radius:6px;" />
    </td>
    <td style="vertical-align:middle;padding-right:14px;">
      <p style="margin:0;font-size:15px;font-weight:700;color:#ffffff;font-family:'Bricolage Grotesque','Sora',sans-serif;"><span style="color:#ffffff;">Ciro</span><span style="color:#e03333;">Stack</span</p>
    </td>
    <td style="vertical-align:middle;border-left:1px solid #334155;padding-left:14px;">
      <p style="margin:0;font-size:13px;color:#94a3b8;">Resources</p>
    </td>
  </tr></table>
</td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="background:#ffffff;padding:40px 32px;">
                      <h1 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:#0f172a;line-height:1.3;">
                        Your resource is on its way
                      </h1>
                      <p style="margin:0 0 16px 0;font-size:15px;color:#334155;line-height:1.7;">
                        Thanks for requesting <strong style="color:#0f172a;">${resourceTitle}</strong>. Our team will send it to this email address within 24 hours.
                      </p>
                      <p style="margin:0 0 28px 0;font-size:15px;color:#334155;line-height:1.7;">
                        In the meantime, our blog covers practical insights on software development, AI, and building products that scale. Take a look when you get a moment.
                      </p>
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <a href="https://cirostack.com/blog" style="display:inline-block;background:#0f172a;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
                              Visit the Blog
                            </a>
                          </td>
                        </tr>
                      </table>
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
    console.error("[api/resources/download]", err);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
