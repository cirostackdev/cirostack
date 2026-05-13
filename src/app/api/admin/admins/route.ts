import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const admins = await prisma.admin.findMany({
      where: { disabled: false },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, role: true, online: true },
    });
    return NextResponse.json(admins);
  } catch (err) {
    console.error("[GET /api/admin/admins]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "super") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, password, role } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "name, email, and password are required" }, { status: 400 });
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.create({
    data: { name, email, passwordHash, role: role === "super" ? "super" : "agent" },
    select: { id: true, name: true, email: true, role: true, disabled: true, online: true, createdAt: true },
  });

  return NextResponse.json({ admin });
}
