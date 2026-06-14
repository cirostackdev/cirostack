import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, rating, feedback } = body;

    if (!conversationId || !rating) {
      return NextResponse.json({ error: "conversationId and rating are required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json({ error: "Rating must be an integer between 1 and 5" }, { status: 400 });
    }

    // Verify caller owns the conversation via visitorToken
    const visitorToken = req.headers.get("x-visitor-token");
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, visitorToken: true },
    });
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
    if (!visitorToken || conversation.visitorToken !== visitorToken) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if already rated
    const existing = await prisma.cSATRating.findUnique({ where: { conversationId } });
    if (existing) {
      return NextResponse.json({ error: "This conversation has already been rated" }, { status: 409 });
    }

    const csatRating = await prisma.cSATRating.create({
      data: { conversationId, rating, feedback: feedback || null },
    });

    return NextResponse.json(csatRating, { status: 201 });
  } catch (error: any) {
    console.error("[CSAT] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
