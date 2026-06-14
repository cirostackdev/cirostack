import { NextRequest, NextResponse } from "next/server";
import { clientAuth } from "@/auth-client";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;
  const client = await prisma.client.findUnique({ where: { id: clientId }, select: { email: true } });
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ projects: [], invoices: [], files: [], messages: [] });

  const search = `%${q}%`;

  // Search projects
  const projects = await prisma.project.findMany({
    where: { clientId, OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] },
    select: { id: true, title: true, status: true },
    take: 10,
  });

  // Search invoices
  const invoices = await prisma.invoice.findMany({
    where: { clientId, OR: [{ number: { contains: q, mode: "insensitive" } }] },
    select: { id: true, number: true, amount: true, status: true },
    take: 10,
  });

  // Search project files
  const files = await prisma.projectFile.findMany({
    where: { project: { clientId }, name: { contains: q, mode: "insensitive" } },
    select: { id: true, name: true, url: true, project: { select: { title: true } } },
    take: 10,
  });

  // Search messages in client's conversations
  const messages = await prisma.message.findMany({
    where: {
      conversation: { visitorEmail: client.email },
      body: { contains: q, mode: "insensitive" },
    },
    select: { id: true, body: true, createdAt: true, conversationId: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ projects, invoices, files, messages });
}
