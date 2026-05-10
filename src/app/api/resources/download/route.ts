import { Resend } from "resend";
import { NextResponse } from "next/server";

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

    // Notify the team
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Resource Request: ${resourceTitle}`,
      html: `
        <h2>Resource Download Request</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
          <tr><td style="font-weight:bold;width:140px;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr style="background:#f9f9f9"><td style="font-weight:bold;">Resource</td><td>${resourceTitle}</td></tr>
          ${resourceType ? `<tr><td style="font-weight:bold;">Type</td><td>${resourceType}</td></tr>` : ""}
        </table>
        <p style="font-family:sans-serif;font-size:14px;color:#555;margin-top:16px;">Send the resource to this person within 24 hours.</p>
      `,
    });

    // Confirm to the requester
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Your CiroStack resource: ${resourceTitle}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111;">
          <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Your resource is on its way</h2>
          <p style="color:#555;line-height:1.6;margin-bottom:12px;">
            Thanks for downloading <strong>${resourceTitle}</strong>. Our team will send it to this email address within 24 hours.
          </p>
          <p style="color:#555;line-height:1.6;">In the meantime, check out our blog for free insights on software, AI, and startup building.</p>
          <a href="https://cirostack.com/blog" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#e03333;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Visit the Blog</a>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="font-size:12px;color:#999;">CiroStack · <a href="https://cirostack.com" style="color:#999;">cirostack.com</a></p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/resources/download]", err);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
