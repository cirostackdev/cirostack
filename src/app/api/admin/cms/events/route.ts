import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(events);
  } catch (err) {
    console.error("[GET /api/admin/cms/events]", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { slug, title, description, date } = body;
    if (!slug || !title || !description || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

    const event = await prisma.event.create({
      data: {
        slug: body.slug,
        type: body.type,
        title: body.title,
        description: body.description,
        date: body.date,
        time: body.time,
        location: body.location,
        attendees: body.attendees,
        featured: body.featured,
        published: body.published,
        registrationUrl: body.registrationUrl,
      },
    });
    revalidatePath("/events");
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/cms/events]", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
