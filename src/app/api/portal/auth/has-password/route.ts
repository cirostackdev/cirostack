import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ hasPassword: false });

    const client = await prisma.client.findUnique({
      where: { email },
      select: { passwordHash: true },
    });

    return NextResponse.json({ hasPassword: !!client?.passwordHash });
  } catch {
    return NextResponse.json({ hasPassword: false });
  }
}
