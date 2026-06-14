import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        avatarUrl: true,
        createdAt: true,
        _count: { select: { projects: true, invoices: true } },
      },
    });
    return NextResponse.json(clients);
  } catch (err) {
    console.error("[GET /api/admin/clients]", err);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { email, name, company } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const client = await prisma.client.create({ data: { email, name, company } });
    return NextResponse.json(client, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    console.error("[POST /api/admin/clients]", err);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
