import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
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

    return NextResponse.json({ conversationId: conversation.id });
  } catch (err) {
    console.error("[api/chat/conversations POST]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
