import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "cirostack@gmail.com";
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

    const isLinkedIn = /^https?:\/\/(www\.)?linkedin\.com\//i.test(linkedin.trim());
    if (!isLinkedIn) {
      return NextResponse.json({ error: "Please enter a valid LinkedIn profile URL (linkedin.com/...)." }, { status: 400 });
    }

    const isGitHub = /^https?:\/\/(www\.)?github\.com\//i.test(github.trim());
    if (!isGitHub) {
      return NextResponse.json({ error: "Please enter a valid GitHub profile URL (github.com/...)." }, { status: 400 });
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
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: TO,
        replyTo: email,
        subject: `Job Application: ${role} from ${fullName}`,
        attachments: [{ filename: cvFile.name, content: cvBuffer }],
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /><style>@media (prefers-color-scheme:dark){.logo-img{background-color:#0f172a !important;border-radius:6px;}}[data-ogsc] .logo-img{background-color:#0f172a !important;border-radius:6px;}</style></head>
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:0;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;">

                  <!-- Header -->
                  <tr>
                    <td style="background:#0f172a;padding:24px 32px;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr>
  <td style="vertical-align:middle;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:10px;vertical-align:middle;">
        <img src="https://cirostack.com/favicon.png" alt="CiroStack" width="28" height="28" class="logo-img" style="display:block;border-radius:6px;" />
      </td>
      <td style="vertical-align:middle;">
        <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;font-family:'Bricolage Grotesque','Sora',sans-serif;"><span style="color:#ffffff;">Ciro</span><span style="color:#e03333;">Stack</span></p>
      </td>
    </tr></table>
  </td>
  <td style="vertical-align:middle;text-align:right;">
    <p style="margin:0;font-size:18px;font-weight:600;color:#94a3b8;font-family:'Bricolage Grotesque','Sora',sans-serif;">Job Application</p>
  </td>
</tr></table>
</td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="background:#ffffff;padding:28px 28px 24px 28px;">
                      <h2 style="margin:0 0 4px 0;font-size:18px;font-weight:700;color:#0f172a;">New Job Application</h2>
                      <p style="margin:0 0 20px 0;font-size:13px;color:#64748b;">Submitted via cirostack.com/careers - CV attached</p>

                      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
                        <tr>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;width:150px;">Full Name</td>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;">${fullName}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Email</td>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;"><a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;">${email}</a></td>
                        </tr>
                        <tr>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Role Applied</td>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;">${role}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Experience</td>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${experience}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">LinkedIn</td>
                          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;color:#0f172a;"><a href="${linkedin}" style="color:#3b82f6;text-decoration:none;">${linkedin}</a></td>
                        </tr>
                        <tr>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">GitHub</td>
                          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;"><a href="${github}" style="color:#3b82f6;text-decoration:none;">${github}</a></td>
                        </tr>
                        <tr>
                          <td style="padding:10px 12px;background:#f8fafc;color:#64748b;font-weight:600;">CV</td>
                          <td style="padding:10px 12px;background:#f8fafc;color:#0f172a;">${cvFile.name} (attached)</td>
                        </tr>
                      </table>

                      <h3 style="margin:24px 0 8px 0;font-size:14px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.05em;">Cover Letter</h3>
                      <div style="background:#f8fafc;border-left:3px solid #0f172a;padding:16px;border-radius:0 6px 6px 0;">
                        <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;white-space:pre-wrap;">${coverLetter}</p>
                      </div>
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
      resend.emails.send({
        from: "CiroStack <noreply@cirostack.com>",
        to: email,
        subject: `We received your application for ${role}`,
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&family=Sora:wght@400;500;600&display=swap" rel="stylesheet"><style>@media (prefers-color-scheme:dark){.logo-img{background-color:#0f172a !important;border-radius:6px;}}[data-ogsc] .logo-img{background-color:#0f172a !important;border-radius:6px;}</style></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Sora',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:0;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;">
        <!-- Header -->
        <tr>
          <td style="background:#0f172a;padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align:middle;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="padding-right:10px;vertical-align:middle;">
                    <img src="https://cirostack.com/favicon.png" alt="CiroStack" width="28" height="28" class="logo-img" style="display:block;border-radius:6px;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;font-family:'Bricolage Grotesque','Sora',sans-serif;"><span style="color:#ffffff;">Ciro</span><span style="color:#e03333;">Stack</span></p>
                  </td>
                </tr></table>
              </td>
              <td style="vertical-align:middle;text-align:right;">
                <p style="margin:0;font-size:18px;font-weight:600;color:#94a3b8;font-family:'Bricolage Grotesque','Sora',sans-serif;">Job Application</p>
              </td>
            </tr></table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px 0;font-size:15px;color:#0f172a;">Hi ${fullName},</p>
            <p style="margin:0 0 16px 0;font-size:15px;color:#334155;line-height:1.6;">Thank you for applying for the ${role} position at CiroStack. We have received your application and CV.</p>
            <p style="margin:0 0 24px 0;font-size:15px;color:#334155;line-height:1.6;">Our hiring team reviews every application carefully. You can expect to hear from us within five business days.</p>
            <p style="margin:0;font-size:15px;color:#334155;line-height:1.6;"></p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">CiroStack | cirostack.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact/careers]", err);
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }
}
