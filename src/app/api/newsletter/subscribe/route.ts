import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? "";
const FROM = "CiroStack Digest <newsletter@cirostack.com>";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });

    if (AUDIENCE_ID) {
      await resend.contacts.create({ audienceId: AUDIENCE_ID, email, unsubscribed: false });
    }

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "You're subscribed to the CiroStack Digest",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111;">
          <h2 style="font-size:22px;font-weight:700;margin-bottom:8px;">Welcome to the CiroStack Digest</h2>
          <p style="color:#555;line-height:1.6;margin-bottom:16px;">
            Every Tuesday you'll get curated insights on software development, AI, and what's moving in the startup world — straight from the CiroStack engineering team.
          </p>
          <p style="color:#555;line-height:1.6;">No fluff, no spam. Unsubscribe anytime.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="font-size:12px;color:#999;">CiroStack · <a href="https://cirostack.com" style="color:#999;">cirostack.com</a></p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/newsletter/subscribe]", err);
    return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
  }
}
