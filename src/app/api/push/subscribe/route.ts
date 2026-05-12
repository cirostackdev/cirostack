import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const adminSession = await auth();
  const clientSession = await clientAuth();

  let ownerType: string;
  let ownerId: string;

  if (adminSession?.user) {
    ownerType = "admin";
    ownerId = (adminSession.user as any).id as string;
  } else if (clientSession?.user) {
    ownerType = "client";
    ownerId = (clientSession.user as any).id as string;
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { endpoint, keys } = await req.json();
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh: keys.p256dh, auth: keys.auth, ownerType, ownerId },
      create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, ownerType, ownerId },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/push/subscribe]", err);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}
