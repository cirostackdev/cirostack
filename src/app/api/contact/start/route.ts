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
      subject: `New Project Brief from ${name}${company ? ` (${company})` : ""}`,
      html: `
        <h2>New Project Brief</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
          <tr><td style="font-weight:bold;width:160px;">Name</td><td>${name}</td></tr>
          <tr style="background:#f9f9f9"><td style="font-weight:bold;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          ${company ? `<tr><td style="font-weight:bold;">Company</td><td>${company}</td></tr>` : ""}
          ${phone ? `<tr style="background:#f9f9f9"><td style="font-weight:bold;">Phone</td><td>${phone}</td></tr>` : ""}
          <tr><td style="font-weight:bold;">Service</td><td>${service}</td></tr>
          ${budget ? `<tr style="background:#f9f9f9"><td style="font-weight:bold;">Budget</td><td>${budget}</td></tr>` : ""}
          ${timeline ? `<tr><td style="font-weight:bold;">Timeline</td><td>${timeline}</td></tr>` : ""}
        </table>
        <h3 style="margin-top:24px;">Project Description</h3>
        <p style="font-family:sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap;">${description}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact/start]", err);
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }
}
