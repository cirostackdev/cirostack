import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";

export async function PATCH(req: Request) {
  const session = await clientAuth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = (session.user as any).id;
  const body = await req.json();
  const { name } = body;

  try {
    const updated = await prisma.client.update({
      where: { id: clientId },
      data: { name: name || null },
      select: { id: true, name: true, email: true },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/portal/settings]", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
