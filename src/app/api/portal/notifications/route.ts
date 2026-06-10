import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientAuth } from "@/auth-client";

export async function GET(req: Request) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where: { clientId } }),
  ]);

  return NextResponse.json({
    notifications,
    pagination: { page, total, pages: Math.ceil(total / limit) },
  });
}

export async function PATCH(req: Request) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;
  const { ids, read } = await req.json();

  if (ids === "all") {
    await prisma.notification.updateMany({
      where: { clientId },
      data: { read: true },
    });
  } else if (Array.isArray(ids)) {
    await prisma.notification.updateMany({
      where: { id: { in: ids }, clientId },
      data: { read: read ?? true },
    });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Notification id required" }, { status: 400 });

  // Verify ownership: only delete if notification belongs to this client
  const notification = await prisma.notification.findFirst({
    where: { id, clientId },
  });
  if (!notification) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.notification.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
