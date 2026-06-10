import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";

// Rate limiting: max 5 conversations per IP per hour
const convRateMap = new Map<string, { count: number; resetAt: number }>();

function isConvRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = convRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    convRateMap.set(ip, { count: 1, resetAt: now + 3600_000 });
    return false;
  }
  entry.count++;
  if (entry.count > 5) return true;
  return false;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isConvRateLimited(ip)) {
    return NextResponse.json({ error: "Too many conversations. Try again later." }, { status: 429 });
  }

  try {
    const { visitorId, name, email, topic, pageUrl } = await req.json();

    if (!visitorId) {
      return NextResponse.json({ error: "visitorId required" }, { status: 400 });
    }

    const conversation = await prisma.conversation.create({
      data: {
        visitorId,
        visitorName: name || null,
        visitorEmail: email || null,
        topic: topic || null,
        metadata: { pageUrl: pageUrl || null },
      },
    });

    // Create welcome message
    const welcome = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderType: "system",
        body: "Welcome to CiroStack support! An agent will be with you shortly.",
      },
    });

    // Notify admins via Pusher
    await pusher.trigger("private-admin-notifications", "conversation-new", {
      conversation: { ...conversation, latestMessage: welcome.body },
    });

    return NextResponse.json({ conversationId: conversation.id });
  } catch (err) {
    console.error("[api/chat/conversations POST]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
