import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Simple in-memory rate limiter: max 3 OTPs per email per 10 minutes
const otpRateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const record = otpRateMap.get(email);
  if (!record || now >= record.resetAt) {
    otpRateMap.set(email, { count: 1, resetAt: now + 10 * 60_000 });
    return false;
  }
  if (record.count >= 3) return true;
  record.count++;
  return false;
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (isRateLimited(email.toLowerCase())) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before requesting another code." },
        { status: 429 }
      );
    }

    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) {
      return NextResponse.json({ error: "No client account found for this email. Contact your project manager." }, { status: 404 });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.client.update({
      where: { id: client.id },
      data: { otpCode: otp, otpExpiry },
    });

    await resend.emails.send({
      from: "CiroStack <noreply@cirostack.com>",
      to: email,
      subject: "Your CiroStack login code",
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
      <p style="margin:0;font-size:15px;font-weight:700;color:#ffffff;">CiroStack</p>
    </td>
    <td style="vertical-align:middle;border-left:1px solid #334155;padding-left:14px;">
      <p style="margin:0;font-size:13px;color:#94a3b8;">Login Code</p>
    </td>
  </tr></table>
</td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="background:#ffffff;padding:40px 32px;">
                      <h1 style="margin:0 0 12px 0;font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;">
                        Your login code
                      </h1>
                      <p style="margin:0 0 28px 0;font-size:15px;color:#475569;line-height:1.6;">
                        Use the code below to sign in to your CiroStack client portal. For your security, this code is valid for 10 minutes only.
                      </p>

                      <!-- OTP Code Block -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
                        <tr>
                          <td align="center" style="background:#f8fafc;border:2px solid #e2e8f0;border-radius:12px;padding:28px 24px;">
                            <span style="font-family:'Courier New',Courier,monospace;font-size:40px;font-weight:700;letter-spacing:12px;color:#0f172a;display:block;line-height:1;">
                              ${otp}
                            </span>
                            <span style="display:block;margin-top:12px;font-size:12px;color:#94a3b8;letter-spacing:0.05em;text-transform:uppercase;">
                              Expires in 10 minutes
                            </span>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
                        If you did not request this code, you can safely ignore this email. Your account remains secure.
                      </p>
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
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/portal/auth/send-otp]", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
