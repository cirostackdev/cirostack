import { NextRequest, NextResponse } from "next/server";
import { clientAuth } from "@/auth-client";
import { prisma } from "@/lib/prisma";

const CATEGORIES = ["messages", "invoices", "projects", "files", "system"];

export async function GET() {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;

  const prefs = await prisma.notificationPreference.findMany({
    where: { clientId },
  });

  // Fill in defaults for missing categories
  const result = CATEGORIES.map((category) => {
    const existing = prefs.find((p) => p.category === category);
    return existing || { clientId, category, push: true, email: true };
  });

  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  const session = await clientAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clientId = (session.user as any).id as string;

  const { preferences } = await req.json();
  if (!Array.isArray(preferences)) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  for (const pref of preferences) {
    if (!CATEGORIES.includes(pref.category)) continue;
    await prisma.notificationPreference.upsert({
      where: { clientId_category: { clientId, category: pref.category } },
      create: { clientId, category: pref.category, push: pref.push ?? true, email: pref.email ?? true },
      update: { push: pref.push ?? true, email: pref.email ?? true },
    });
  }

  return NextResponse.json({ ok: true });
}
