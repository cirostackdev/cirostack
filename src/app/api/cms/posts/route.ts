import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { dateSort: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        author: true,
        date: true,
        dateSort: true,
        readMin: true,
        imageUrl: true,
        featured: true,
        tags: true,
      },
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error("[GET /api/cms/posts]", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
