import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "contact@cirostack.com";
const FROM = "CiroStack Forms <forms@cirostack.com>";

export async function POST(req: Request) {
  try {
    const { name, email, organisation, requestType, eventDate, details } = await req.json();

    if (!name || !email || !organisation || !requestType || !details) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Press / Speaking Request from ${name} (${organisation})`,
      html: `
        <h2>New Press & Speaking Request</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
          <tr><td style="font-weight:bold;width:160px;">Name</td><td>${name}</td></tr>
          <tr style="background:#f9f9f9"><td style="font-weight:bold;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="font-weight:bold;">Organisation</td><td>${organisation}</td></tr>
          <tr style="background:#f9f9f9"><td style="font-weight:bold;">Request Type</td><td>${requestType}</td></tr>
          ${eventDate ? `<tr><td style="font-weight:bold;">Event Date</td><td>${eventDate}</td></tr>` : ""}
        </table>
        <h3 style="margin-top:24px;">Details</h3>
        <p style="font-family:sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap;">${details}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact/press]", err);
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }
}
