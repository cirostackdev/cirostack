import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "contact@cirostack.com";
const FROM = "CiroStack Forms <forms@cirostack.com>";

const MAX_CV_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const fullName    = formData.get("fullName") as string;
    const email       = formData.get("email") as string;
    const role        = formData.get("role") as string;
    const linkedin    = formData.get("linkedin") as string;
    const github      = formData.get("github") as string;
    const experience  = formData.get("experience") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const cvFile      = formData.get("cv") as File | null;

    if (!fullName || !email || !role || !linkedin || !github || !experience || !coverLetter || !cvFile) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (cvFile.size > MAX_CV_SIZE) {
      return NextResponse.json({ error: "CV file too large (max 5 MB)." }, { status: 413 });
    }

    if (!ALLOWED_CV_TYPES.includes(cvFile.type)) {
      return NextResponse.json({ error: "CV must be a PDF or Word document." }, { status: 415 });
    }

    // Read CV file
    const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
    const cvBase64 = cvBuffer.toString("base64");

    // Store submission (CV as base64 so it's downloadable from admin)
    prisma.formSubmission.create({
      data: {
        type: "careers",
        data: {
          fullName, email, role, linkedin, github, experience, coverLetter,
          cvFileName: cvFile.name,
          cvMimeType: cvFile.type,
          cvBase64,
        },
      },
    }).catch(console.error);

    prisma.lead.upsert({
      where: { email },
      update: { name: fullName, source: "careers" },
      create: { email, name: fullName, source: "careers", tags: ["applicant", role] },
    }).catch(console.error);

    // Send email with CV attached
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Job Application: ${role} — ${fullName}`,
      attachments: [{ filename: cvFile.name, content: cvBuffer }],
      html: `
        <h2>New Job Application</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
          <tr><td style="font-weight:bold;width:160px;">Name</td><td>${fullName}</td></tr>
          <tr style="background:#f9f9f9"><td style="font-weight:bold;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="font-weight:bold;">Role</td><td>${role}</td></tr>
          <tr style="background:#f9f9f9"><td style="font-weight:bold;">Experience</td><td>${experience}</td></tr>
          <tr><td style="font-weight:bold;">LinkedIn</td><td><a href="${linkedin}">${linkedin}</a></td></tr>
          <tr style="background:#f9f9f9"><td style="font-weight:bold;">GitHub</td><td><a href="${github}">${github}</a></td></tr>
          <tr><td style="font-weight:bold;">CV</td><td>${cvFile.name} (attached)</td></tr>
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
