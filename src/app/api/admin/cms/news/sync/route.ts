import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { runNewsSync } from "@/lib/news-sync";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await runNewsSync();
    return NextResponse.json({ success: true, source: "techcrunch", ...result });
  } catch (err) {
    console.error("[admin/news/sync]", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
