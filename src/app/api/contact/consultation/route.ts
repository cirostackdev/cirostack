import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "contact@cirostack.com";
const FROM = "CiroStack Forms <forms@cirostack.com>";

export async function POST(req: Request) {
  try {
    const { name, email, company, timezone, timeOfDay, message } = await req.json();

    if (!name || !email || !timezone || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    prisma.formSubmission.create({ data: { type: "consultation", data: { name, email, company, timezone, timeOfDay, message } } }).catch(console.error);
    prisma.lead.upsert({ where: { email }, update: { name, source: "consultation" }, create: { email, name, source: "consultation", tags: ["consultation"] } }).catch(console.error);

    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Consultation Request from ${name}`,
      html: `
        <h2>New Consultation Request</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
          <tr><td style="font-weight:bold;width:160px;">Name</td><td>${name}</td></tr>
          <tr style="background:#f9f9f9"><td style="font-weight:bold;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          ${company ? `<tr><td style="font-weight:bold;">Company</td><td>${company}</td></tr>` : ""}
          <tr style="background:#f9f9f9"><td style="font-weight:bold;">Time Zone</td><td>${timezone}</td></tr>
          ${timeOfDay ? `<tr><td style="font-weight:bold;">Preferred Time</td><td>${timeOfDay}</td></tr>` : ""}
        </table>
        <h3 style="margin-top:24px;">What they want to discuss</h3>
        <p style="font-family:sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact/consultation]", err);
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }
}
