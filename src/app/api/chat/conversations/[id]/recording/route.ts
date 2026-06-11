import { NextResponse } from "next/server";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { recording } = await req.json();
  await pusher.trigger(`private-conversation-${id}`, "visitor-recording", { recording: !!recording });
  await pusher.trigger("private-admin-notifications", "visitor-recording-notification", {
    conversationId: id,
    recording: !!recording,
  });
  return NextResponse.json({ ok: true });
}
