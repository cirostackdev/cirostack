import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "contact@cirostack.com";
const FROM = "CiroStack Forms <forms@cirostack.com>";

export async function POST(req: Request) {
  try {
    const { fullName, email, role, linkedin, portfolio, experience, coverLetter } = await req.json();

    if (!fullName || !email || !role || !experience || !coverLetter) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Job Application: ${role} — ${fullName}`,
      html: `
        <h2>New Job Application</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
          <tr><td style="font-weight:bold;width:160px;">Name</td><td>${fullName}</td></tr>
          <tr style="background:#f9f9f9"><td style="font-weight:bold;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="font-weight:bold;">Role</td><td>${role}</td></tr>
          <tr style="background:#f9f9f9"><td style="font-weight:bold;">Experience</td><td>${experience}</td></tr>
          ${linkedin ? `<tr><td style="font-weight:bold;">LinkedIn</td><td><a href="${linkedin}">${linkedin}</a></td></tr>` : ""}
          ${portfolio ? `<tr style="background:#f9f9f9"><td style="font-weight:bold;">Portfolio / GitHub</td><td><a href="${portfolio}">${portfolio}</a></td></tr>` : ""}
        </table>
        <h3 style="margin-top:24px;">Cover Letter</h3>
        <p style="font-family:sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap;">${coverLetter}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact/careers]", err);
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }
}
