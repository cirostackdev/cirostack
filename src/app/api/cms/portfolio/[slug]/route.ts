import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  try {
    const project = await prisma.portfolioProject.findFirst({
      where: { slug, published: true },
    });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (err) {
    console.error("[GET /api/cms/portfolio/[slug]]", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
