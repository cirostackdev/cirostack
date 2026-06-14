import { NextRequest, NextResponse } from "next/server";
import { runNewsSync } from "@/lib/news-sync";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Fail closed: if CRON_SECRET is not set, block all access
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const source = new URL(req.url).searchParams.get("source");

  try {
    const result = await runNewsSync(source);
    return NextResponse.json({ success: true, source: source ?? "all", ...result });
  } catch (err) {
    console.error("[news/sync]", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
