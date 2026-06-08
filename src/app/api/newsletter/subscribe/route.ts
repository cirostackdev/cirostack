import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? "";
const FROM = "CiroStack Digest <newsletter@cirostack.com>";

const days = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });

    if (AUDIENCE_ID) {
      await resend.contacts.create({ audienceId: AUDIENCE_ID, email, unsubscribed: false });
    }

    prisma.lead.upsert({ where: { email }, update: { source: "newsletter" }, create: { email, source: "newsletter", tags: ["newsletter"] } }).catch(console.error);
    prisma.formSubmission.create({ data: { type: "newsletter", data: { email } } }).catch(console.error);

    await Promise.all([
      // Email 1: Welcome (immediate)
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "Welcome to the CiroStack Digest",
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
                      <td style="background:#0f172a;border-radius:12px 12px 0 0;padding:28px 32px;">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td>
                              <table cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding-right:12px;">
                                    <img src="https://cirostack.com/favicon.png" alt="CiroStack" width="36" height="36" style="display:block;border-radius:8px;" />
                                  </td>
                                  <td>
                                    <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">CiroStack</span>
                                    <span style="display:block;color:#94a3b8;font-size:12px;margin-top:2px;">Digest</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="background:#ffffff;padding:40px 32px;">
                        <h1 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:#0f172a;line-height:1.3;">
                          You're in. Welcome to the Digest.
                        </h1>
                        <p style="margin:0 0 16px 0;font-size:15px;color:#334155;line-height:1.7;">
                          Every Tuesday, you'll get curated insights on software development, AI, and what's moving in the startup world - straight from the CiroStack engineering team.
                        </p>
                        <p style="margin:0 0 28px 0;font-size:15px;color:#334155;line-height:1.7;">
                          We keep it short, practical, and worth your time. No filler, no spam. Unsubscribe anytime.
                        </p>
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td>
                              <a href="https://cirostack.com/blog" style="display:inline-block;background:#0f172a;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
                                Explore the Blog
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
                          CiroStack | <a href="https://cirostack.com" style="color:#94a3b8;text-decoration:none;">cirostack.com</a> &nbsp;|&nbsp; <a href="https://cirostack.com/newsletter" style="color:#94a3b8;text-decoration:none;">Unsubscribe</a>
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

      // Email 2: Day 3 — Top read
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "Our most-read piece this year",
        scheduledAt: days(3),
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
                      <td style="background:#0f172a;border-radius:12px 12px 0 0;padding:28px 32px;">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td>
                              <table cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding-right:12px;">
                                    <img src="https://cirostack.com/favicon.png" alt="CiroStack" width="36" height="36" style="display:block;border-radius:8px;" />
                                  </td>
                                  <td>
                                    <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">CiroStack</span>
                                    <span style="display:block;color:#94a3b8;font-size:12px;margin-top:2px;">Digest</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="background:#ffffff;padding:40px 32px;">
                        <p style="margin:0 0 20px 0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;">Most Read This Year</p>
                        <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;">
                          Why Fixed-Price Development Beats Hourly Billing
                        </h1>
                        <p style="margin:0 0 16px 0;font-size:15px;color:#334155;line-height:1.7;">
                          Since you're new here, we wanted to share the piece that resonates most with our readers.
                        </p>
                        <p style="margin:0 0 16px 0;font-size:15px;color:#334155;line-height:1.7;">
                          It covers the misalignment of incentives in hourly billing, how fixed-price inverts those incentives, and why clients consistently get better outcomes - and far less stress - when the total cost is agreed upfront.
                        </p>
                        <p style="margin:0 0 28px 0;font-size:15px;color:#334155;line-height:1.7;">
                          If you've ever felt burned by scope creep or runaway billing, this one is for you.
                        </p>
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td>
                              <a href="https://cirostack.com/blog/why-fixed-price" style="display:inline-block;background:#0f172a;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
                                Read the Article
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
                          CiroStack | <a href="https://cirostack.com" style="color:#94a3b8;text-decoration:none;">cirostack.com</a> &nbsp;|&nbsp; <a href="https://cirostack.com/newsletter" style="color:#94a3b8;text-decoration:none;">Unsubscribe</a>
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

      // Email 3: Day 7 — Case study spotlight
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "Case study: 40% faster delivery for a healthtech startup",
        scheduledAt: days(7),
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
                      <td style="background:#0f172a;border-radius:12px 12px 0 0;padding:28px 32px;">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td>
                              <table cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding-right:12px;">
                                    <img src="https://cirostack.com/favicon.png" alt="CiroStack" width="36" height="36" style="display:block;border-radius:8px;" />
                                  </td>
                                  <td>
                                    <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">CiroStack</span>
                                    <span style="display:block;color:#94a3b8;font-size:12px;margin-top:2px;">Digest</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="background:#ffffff;padding:40px 32px;">
                        <p style="margin:0 0 20px 0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;">Case Study</p>
                        <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;">
                          From 0 to HIPAA-compliant in 10 weeks
                        </h1>
                        <p style="margin:0 0 16px 0;font-size:15px;color:#334155;line-height:1.7;">
                          HealthFlow needed a telehealth platform that could handle sensitive patient data, integrate with three existing EMR systems, and pass a compliance audit - all before a hard regulatory deadline.
                        </p>
                        <p style="margin:0 0 28px 0;font-size:15px;color:#334155;line-height:1.7;">
                          Here's how we shipped it 40% faster than their previous agency estimated, on a fixed price.
                        </p>
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td>
                              <a href="https://cirostack.com/portfolio/healthflow" style="display:inline-block;background:#0f172a;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
                                Read the Case Study
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
                          CiroStack | <a href="https://cirostack.com" style="color:#94a3b8;text-decoration:none;">cirostack.com</a> &nbsp;|&nbsp; <a href="https://cirostack.com/newsletter" style="color:#94a3b8;text-decoration:none;">Unsubscribe</a>
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

      // Email 4: Day 14 — Free consultation offer
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "Got a project in mind? Let's talk.",
        scheduledAt: days(14),
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
                      <td style="background:#0f172a;border-radius:12px 12px 0 0;padding:28px 32px;">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td>
                              <table cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding-right:12px;">
                                    <img src="https://cirostack.com/favicon.png" alt="CiroStack" width="36" height="36" style="display:block;border-radius:8px;" />
                                  </td>
                                  <td>
                                    <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">CiroStack</span>
                                    <span style="display:block;color:#94a3b8;font-size:12px;margin-top:2px;">Digest</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="background:#ffffff;padding:40px 32px;">
                        <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;">
                          A free 30-minute call. No strings attached.
                        </h1>
                        <p style="margin:0 0 16px 0;font-size:15px;color:#334155;line-height:1.7;">
                          You've been reading our content for a couple of weeks, so we wanted to extend a personal invitation: if you have a product idea, a technical problem, or you're just trying to figure out what's possible - book a free call with one of our senior engineers.
                        </p>
                        <p style="margin:0 0 20px 0;font-size:15px;color:#334155;line-height:1.7;">
                          No sales pitch. No obligation. Just an honest conversation about your situation.
                        </p>
                        <table cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;width:100%;">
                          <tr>
                            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                              <p style="margin:0;font-size:14px;color:#334155;">You talk to an engineer, not an account manager</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                              <p style="margin:0;font-size:14px;color:#334155;">We'll tell you if we're not the right fit</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;">
                              <p style="margin:0;font-size:14px;color:#334155;">Follow-up notes sent within 2 hours</p>
                            </td>
                          </tr>
                        </table>
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td>
                              <a href="https://cirostack.com/contact/consultation" style="display:inline-block;background:#0f172a;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
                                Book a Free Call
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
                          CiroStack | <a href="https://cirostack.com" style="color:#94a3b8;text-decoration:none;">cirostack.com</a> &nbsp;|&nbsp; <a href="https://cirostack.com/newsletter" style="color:#94a3b8;text-decoration:none;">Unsubscribe</a>
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
    console.error("[api/newsletter/subscribe]", err);
    return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
  }
}
