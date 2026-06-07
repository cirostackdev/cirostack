import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { runNewsSync } from "@/lib/news-sync";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { source } = await req.json();

  try {
    const result = await runNewsSync(source);
    return NextResponse.json({ success: true, source: source ?? "all", ...result });
  } catch (err) {
    console.error("[admin/news/sync]", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
