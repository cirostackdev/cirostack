import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? "";
const FROM = "CiroStack Digest <newsletter@cirostack.com>";

const days = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });

    if (AUDIENCE_ID) {
      await resend.contacts.create({ audienceId: AUDIENCE_ID, email, unsubscribed: false });
    }

    await Promise.all([
      // Email 1: Welcome (immediate)
      resend.emails.send({
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
      }),

      // Email 2: Day 3 — Top read
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "Your first deep dive: Why Fixed-Price Development Wins",
        scheduledAt: days(3),
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111;">
            <p style="font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">CiroStack Digest</p>
            <h2 style="font-size:22px;font-weight:700;margin-bottom:8px;">Our most-read post of the year</h2>
            <p style="color:#555;line-height:1.6;margin-bottom:24px;">
              Since you're new here, we wanted to share the piece that resonates most with our readers:
              <strong>"Why Fixed-Price Development Beats Hourly Billing"</strong>.
            </p>
            <p style="color:#555;line-height:1.6;margin-bottom:24px;">
              It covers the misalignment of incentives in hourly billing, how fixed-price inverts those incentives, and why clients consistently get better results — and lower stress — when the total cost is agreed upfront.
            </p>
            <a href="https://cirostack.com/blog/why-fixed-price" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Read the article →</a>
            <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
            <p style="font-size:12px;color:#999;">CiroStack · <a href="https://cirostack.com" style="color:#999;">cirostack.com</a> · <a href="https://cirostack.com/newsletter" style="color:#999;">Unsubscribe</a></p>
          </div>
        `,
      }),

      // Email 3: Day 7 — Case study spotlight
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "Case study: 40% faster delivery for a healthtech startup",
        scheduledAt: days(7),
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111;">
            <p style="font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">CiroStack Digest</p>
            <h2 style="font-size:22px;font-weight:700;margin-bottom:8px;">From 0 to HIPAA-compliant in 10 weeks</h2>
            <p style="color:#555;line-height:1.6;margin-bottom:16px;">
              HealthFlow needed a telehealth platform that could handle sensitive patient data, integrate with three existing EMR systems, and pass a compliance audit — all before a hard regulatory deadline.
            </p>
            <p style="color:#555;line-height:1.6;margin-bottom:24px;">
              Here's how we shipped it 40% faster than their previous agency estimated, on a fixed price.
            </p>
            <a href="https://cirostack.com/portfolio/healthflow" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Read the case study →</a>
            <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
            <p style="font-size:12px;color:#999;">CiroStack · <a href="https://cirostack.com" style="color:#999;">cirostack.com</a> · <a href="https://cirostack.com/newsletter" style="color:#999;">Unsubscribe</a></p>
          </div>
        `,
      }),

      // Email 4: Day 14 — Free consultation offer
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "Got a project in mind? Let's talk.",
        scheduledAt: days(14),
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111;">
            <p style="font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">CiroStack Digest</p>
            <h2 style="font-size:22px;font-weight:700;margin-bottom:8px;">A free 30-minute call — no strings attached</h2>
            <p style="color:#555;line-height:1.6;margin-bottom:16px;">
              You've been reading our content for a couple of weeks, so we wanted to extend a personal invitation: if you have a product idea, a technical problem, or you're just trying to figure out what's possible — book a free call with one of our senior engineers.
            </p>
            <p style="color:#555;line-height:1.6;margin-bottom:16px;">
              No sales pitch. No obligation. Just an honest conversation about your situation.
            </p>
            <ul style="color:#555;line-height:1.6;margin-bottom:24px;padding-left:20px;">
              <li>You talk to an engineer, not an account manager</li>
              <li>We'll tell you if we're not the right fit</li>
              <li>Follow-up notes sent within 2 hours</li>
            </ul>
            <a href="https://cirostack.com/contact/consultation" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Book a free call →</a>
            <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
            <p style="font-size:12px;color:#999;">CiroStack · <a href="https://cirostack.com" style="color:#999;">cirostack.com</a> · <a href="https://cirostack.com/newsletter" style="color:#999;">Unsubscribe</a></p>
          </div>
        `,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/newsletter/subscribe]", err);
    return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
  }
}
