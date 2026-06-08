import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EVENTS = "CiroStack Events <events@cirostack.com>";
const TEAM_EMAIL = "contact@cirostack.com";

export async function POST(req: Request) {
  try {
    const { name, email, company, eventTitle, eventDate, eventLocation } = await req.json();

    if (!name || !email || !eventTitle) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    prisma.formSubmission.create({ data: { type: "events", data: { name, email, company, eventTitle, eventDate, eventLocation } } }).catch(console.error);
    prisma.lead.upsert({ where: { email }, update: { name, source: "events" }, create: { email, name, source: "events", tags: ["event-registrant"] } }).catch(console.error);

    await Promise.all([
      // Confirmation to registrant
      resend.emails.send({
        from: FROM_EVENTS,
        to: email,
        subject: `Registration Confirmed: ${eventTitle}`,
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
      <p style="margin:0;font-size:15px;font-weight:700;color:#ffffff;"><span style="color:#ffffff;">Ciro</span><span style="color:#e03333;">Stack</span</p>
    </td>
    <td style="vertical-align:middle;border-left:1px solid #334155;padding-left:14px;">
      <p style="margin:0;font-size:13px;color:#94a3b8;">Event Registration</p>
    </td>
  </tr></table>
</td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="background:#ffffff;padding:40px 32px;">
                        <h1 style="margin:0 0 8px 0;font-size:24px;font-weight:700;color:#0f172a;line-height:1.3;">
                          You're registered, ${name}!
                        </h1>
                        <p style="margin:0 0 28px 0;font-size:15px;color:#475569;line-height:1.6;">
                          Your spot is confirmed for <strong style="color:#0f172a;">${eventTitle}</strong>. We're looking forward to seeing you there.
                        </p>

                        <!-- Event Details Card -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin:0 0 28px 0;">
                          <tr>
                            <td style="padding:20px 24px;">
                              <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Event Details</p>
                              <p style="margin:0 0 16px 0;font-size:17px;font-weight:700;color:#0f172a;">${eventTitle}</p>
                              <table cellpadding="0" cellspacing="0" width="100%">
                                ${eventDate ? `
                                <tr>
                                  <td style="padding:6px 0;color:#64748b;font-size:13px;width:90px;">Date</td>
                                  <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${eventDate}</td>
                                </tr>` : ""}
                                ${eventLocation ? `
                                <tr>
                                  <td style="padding:6px 0;color:#64748b;font-size:13px;">Location</td>
                                  <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${eventLocation}</td>
                                </tr>` : ""}
                                ${company ? `
                                <tr>
                                  <td style="padding:6px 0;color:#64748b;font-size:13px;">Company</td>
                                  <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${company}</td>
                                </tr>` : ""}
                              </table>
                            </td>
                          </tr>
                        </table>

                        <p style="margin:0 0 24px 0;font-size:15px;color:#475569;line-height:1.7;">
                          We'll send you a reminder with joining instructions 24 hours before the event. If you have any questions in the meantime, simply reply to this email.
                        </p>

                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td>
                              <a href="https://cirostack.com/events" style="display:inline-block;background:#0f172a;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
                                View All Events
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
      }),

      // Notify team
      resend.emails.send({
        from: FROM_EVENTS,
        to: TEAM_EMAIL,
        subject: `New Event Registration: ${eventTitle}`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /></head>
          <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
              <tr>
                <td align="center">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

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
      <p style="margin:0;font-size:13px;color:#94a3b8;">New Registration</p>
    </td>
  </tr></table>
</td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="background:#ffffff;padding:28px 28px 24px 28px;">
                        <h2 style="margin:0 0 4px 0;font-size:18px;font-weight:700;color:#0f172a;">New Event Registration</h2>
                        <p style="margin:0 0 20px 0;font-size:13px;color:#64748b;">Submitted via cirostack.com/events</p>

                        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
                          <tr>
                            <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;width:150px;">Event</td>
                            <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;">${eventTitle}</td>
                          </tr>
                          <tr>
                            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Name</td>
                            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${name}</td>
                          </tr>
                          <tr>
                            <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Email</td>
                            <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;"><a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;">${email}</a></td>
                          </tr>
                          <tr>
                            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Company</td>
                            <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${company || "Not provided"}</td>
                          </tr>
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
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/events/register]", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
