import { NextResponse } from "next/server";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { typing } = await req.json();
  await pusher.trigger(`private-conversation-${id}`, "visitor-typing", { typing: !!typing });
  // Also notify the admin notification channel so the conversation list can show "typing..."
  await pusher.trigger("private-admin-notifications", "visitor-typing-notification", {
    conversationId: id,
    typing: !!typing,
  });
  return NextResponse.json({ ok: true });
}
