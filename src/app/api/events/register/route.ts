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
        subject: `You're registered: ${eventTitle}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111;">
            <h2 style="font-size:22px;font-weight:700;margin-bottom:8px;">You're in, ${name}!</h2>
            <p style="color:#555;line-height:1.6;margin-bottom:16px;">
              Thanks for registering for <strong>${eventTitle}</strong>.
            </p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr><td style="padding:8px 0;color:#999;font-size:13px;border-bottom:1px solid #eee;">Date</td><td style="padding:8px 0;font-size:13px;font-weight:600;border-bottom:1px solid #eee;">${eventDate}</td></tr>
              <tr><td style="padding:8px 0;color:#999;font-size:13px;border-bottom:1px solid #eee;">Location</td><td style="padding:8px 0;font-size:13px;font-weight:600;border-bottom:1px solid #eee;">${eventLocation}</td></tr>
              ${company ? `<tr><td style="padding:8px 0;color:#999;font-size:13px;">Company</td><td style="padding:8px 0;font-size:13px;font-weight:600;">${company}</td></tr>` : ""}
            </table>
            <p style="color:#555;line-height:1.6;margin-bottom:24px;">
              We'll send you a reminder with joining instructions 24 hours before the event.
              If you have any questions in the meantime, reply to this email.
            </p>
            <a href="https://cirostack.com/events" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View All Events</a>
            <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
            <p style="font-size:12px;color:#999;">CiroStack · <a href="https://cirostack.com" style="color:#999;">cirostack.com</a></p>
          </div>
        `,
      }),

      // Notify team
      resend.emails.send({
        from: FROM_EVENTS,
        to: TEAM_EMAIL,
        subject: `New event registration: ${eventTitle}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111;">
            <h2 style="font-size:18px;font-weight:700;margin-bottom:16px;">New Registration</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#999;font-size:13px;border-bottom:1px solid #eee;width:120px;">Event</td><td style="padding:8px 0;font-size:13px;font-weight:600;border-bottom:1px solid #eee;">${eventTitle}</td></tr>
              <tr><td style="padding:8px 0;color:#999;font-size:13px;border-bottom:1px solid #eee;">Name</td><td style="padding:8px 0;font-size:13px;font-weight:600;border-bottom:1px solid #eee;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#999;font-size:13px;border-bottom:1px solid #eee;">Email</td><td style="padding:8px 0;font-size:13px;font-weight:600;border-bottom:1px solid #eee;">${email}</td></tr>
              <tr><td style="padding:8px 0;color:#999;font-size:13px;">Company</td><td style="padding:8px 0;font-size:13px;font-weight:600;">${company || "—"}</td></tr>
            </table>
          </div>
        `,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/events/register]", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
