import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { dateSort: "desc" },
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error("[GET /api/admin/cms/posts]", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { slug, title, excerpt, category, author, date, dateSort, readMin, imageUrl, featured, published, tags, body: postBody } = body;

    if (!slug || !title || !excerpt || !category || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        category,
        author: author ?? "CiroStack Team",
        date,
        dateSort: new Date(dateSort ?? date),
        readMin: readMin ?? 5,
        imageUrl: imageUrl ?? null,
        featured: featured ?? false,
        published: published ?? false,
        tags: tags ?? [],
        body: postBody ?? null,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error("[POST /api/admin/cms/posts]", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
