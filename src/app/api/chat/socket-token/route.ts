import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSocketToken } from "@/sockets/chat";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminId = (session.user as any).id as string;
  const token = createSocketToken(adminId);

  return NextResponse.json({ token });
}
