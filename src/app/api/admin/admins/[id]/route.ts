import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "super") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { disabled } = await req.json();

  await prisma.admin.update({ where: { id }, data: { disabled } });
  return NextResponse.json({ ok: true });
}
