import { NextResponse } from "next/server";
import { isOnline } from "@/lib/chat-state";

export async function GET() {
  return NextResponse.json({ online: isOnline() });
}
