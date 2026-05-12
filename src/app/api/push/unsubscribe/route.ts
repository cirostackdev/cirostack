import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { endpoint } = await req.json();
    if (!endpoint) return NextResponse.json({ error: "Endpoint required" }, { status: 400 });

    await prisma.pushSubscription.deleteMany({ where: { endpoint } }).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/push/unsubscribe]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
