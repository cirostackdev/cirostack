import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { password } = await req.json();
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const clientId = (session.user as any).id as string;
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.client.update({
    where: { id: clientId },
    data: { passwordHash },
  });

  return NextResponse.json({ ok: true });
}
