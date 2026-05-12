import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { date: "desc" },
      select: {
        id: true,
        slug: true,
        type: true,
        title: true,
        summary: true,
        date: true,
        tag: true,
        featured: true,
        published: true,
      },
    });
    return NextResponse.json(announcements);
  } catch (err) {
    console.error("[GET /api/admin/cms/announcements]", err);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { slug, title, summary, date } = body;
    if (!slug || !title || !summary || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.announcement.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

    const announcement = await prisma.announcement.create({ data: body });
    revalidatePath("/newsroom");
    return NextResponse.json(announcement, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/cms/announcements]", err);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
