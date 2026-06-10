import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { clientAuth } from "@/auth-client";

export async function POST(req: Request) {
  // Require at least one valid session (admin or client)
  const adminSession = await auth();
  const clientSession = await clientAuth();

  if (!adminSession?.user && !clientSession?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
