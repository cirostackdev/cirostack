import { NextResponse } from "next/server";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { typing } = await req.json();
  await pusher.trigger(`private-conversation-${id}`, "visitor-typing", { typing: !!typing });
  return NextResponse.json({ ok: true });
}
