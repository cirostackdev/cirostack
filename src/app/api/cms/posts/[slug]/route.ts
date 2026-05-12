import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
    });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    console.error("[GET /api/cms/posts/[slug]]", err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
