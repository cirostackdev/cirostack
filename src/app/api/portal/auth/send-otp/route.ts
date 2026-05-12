import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Auto-create client if they don't exist
    let client = await prisma.client.findUnique({ where: { email } });
    if (!client) {
      client = await prisma.client.create({ data: { email } });
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
        <div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:32px;">
          <h2 style="margin-bottom:8px;">Your login code</h2>
          <p style="color:#555;margin-bottom:24px;">Enter this code to sign in to your CiroStack client portal. It expires in 10 minutes.</p>
          <div style="background:#f5f5f5;border-radius:8px;padding:24px;text-align:center;font-size:36px;font-weight:bold;letter-spacing:8px;">${otp}</div>
          <p style="color:#999;font-size:12px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/portal/auth/send-otp]", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
