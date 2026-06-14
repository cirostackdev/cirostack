import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let hours = await prisma.businessHours.findMany({ orderBy: { day: "asc" } });

  // Seed defaults if none exist
  if (hours.length === 0) {
    const defaults = DAYS.map((_, i) => ({
      day: i,
      startTime: "09:00",
      endTime: "17:00",
      enabled: i >= 1 && i <= 5, // Mon-Fri enabled
      timezone: "UTC",
    }));
    await prisma.businessHours.createMany({ data: defaults });
    hours = await prisma.businessHours.findMany({ orderBy: { day: "asc" } });
  }

  return NextResponse.json(hours);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { hours } = await req.json();
  if (!Array.isArray(hours)) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  for (const h of hours) {
    await prisma.businessHours.upsert({
      where: { id: h.id },
      create: { day: h.day, startTime: h.startTime, endTime: h.endTime, enabled: h.enabled, timezone: h.timezone || "UTC" },
      update: { startTime: h.startTime, endTime: h.endTime, enabled: h.enabled, timezone: h.timezone || "UTC" },
    });
  }

  return NextResponse.json({ ok: true });
}
