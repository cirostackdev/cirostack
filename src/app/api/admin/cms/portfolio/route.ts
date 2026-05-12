import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const projects = await prisma.portfolioProject.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        client: true,
        vertical: true,
        service: true,
        published: true,
        featured: true,
        createdAt: true,
      },
    });
    return NextResponse.json(projects);
  } catch (err) {
    console.error("[GET /api/admin/cms/portfolio]", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { slug, title, client, vertical, category, service, description } = body;
    if (!slug || !title || !client || !vertical || !service || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.portfolioProject.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

    const project = await prisma.portfolioProject.create({ data: body });
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/cms/portfolio]", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
