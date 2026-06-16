import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

// Lazy init — avoid module-level instantiation failing during build
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already exists
    const existing = await prisma.lead.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ message: "Already on the waitlist!" }, { status: 200 });
    }

    // Save to Neon DB as a Lead
    await prisma.lead.create({
      data: {
        email: normalizedEmail,
        source: "cirolabs-waitlist",
        tags: ["cirolabs", "waitlist", "new"],
      },
    });

    // Send confirmation email via Resend
    await getResend().emails.send({
      from: "CiroLabs <hello@cirostack.com>",
      to: normalizedEmail,
      subject: "You're on the CiroLabs waitlist!",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">
            You're in! 🎉
          </h1>
          <p style="color: #6B6560; line-height: 1.6; margin-bottom: 24px;">
            Thanks for joining the CiroLabs waitlist. We're building the mobile app
            right now and you'll be among the first to get access.
          </p>
          <p style="color: #6B6560; line-height: 1.6; margin-bottom: 24px;">
            In the meantime, the full CiroLabs platform is live on web at
            <a href="https://academy.cirostack.com" style="color: #E53935;">academy.cirostack.com</a>.
          </p>
          <p style="color: #94A3B8; font-size: 12px;">
            — The CiroStack team
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Success!" }, { status: 201 });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
