import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { source } = await req.json();
  const cronSecret = process.env.CRON_SECRET;

  const baseUrl = process.env.NEXTAUTH_URL || "https://www.cirostack.com";
  const url = `${baseUrl}/api/news/sync${source ? `?source=${source}` : ""}`;

  const res = await fetch(url, {
    headers: cronSecret ? { Authorization: `Bearer ${cronSecret}` } : {},
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: "Sync failed", detail: text }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
