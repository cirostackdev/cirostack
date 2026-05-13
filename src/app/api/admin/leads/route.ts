import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(leads);
  } catch (err) {
    console.error("[GET /api/admin/leads]", err);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { email, name, source, tags } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    const lead = await prisma.lead.create({
      data: { email, name: name || null, source: source || null, tags: tags ?? [] },
    });
    return NextResponse.json(lead, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    console.error("[POST /api/admin/leads]", err);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
