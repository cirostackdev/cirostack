import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        type: true,
        title: true,
        description: true,
        pages: true,
        tags: true,
        isNew: true,
        published: true,
        downloadUrl: true,
        createdAt: true,
      },
    });
    return NextResponse.json(resources);
  } catch (err) {
    console.error("[GET /api/admin/cms/resources]", err);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { slug, title, description } = body;
    if (!slug || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.resource.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

    const resource = await prisma.resource.create({ data: body });
    revalidatePath("/resources");
    return NextResponse.json(resource, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/cms/resources]", err);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
