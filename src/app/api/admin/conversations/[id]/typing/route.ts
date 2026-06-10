import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { typing } = await req.json();
  await pusher.trigger(`private-conversation-${id}`, "agent-typing", { typing: !!typing });
  return NextResponse.json({ ok: true });
}
