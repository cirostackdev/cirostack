import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import blogPostsJson from "../../../../../public/content/blog-posts.json";
import careersJson from "../../../../../public/content/careers.json";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results: string[] = [];

  try {
    // ── Blog posts ──────────────────────────────────────────────────────
    const blogCount = await prisma.blogPost.count();
    if (blogCount === 0) {
      const posts = blogPostsJson as {
        id: string;
        title: string;
        excerpt: string;
        category: string;
        author?: string;
        date: string;
        dateSort: string;
        readMin: number;
        imageKey?: string;
        featured?: boolean;
        tags: string[];
      }[];

      for (const p of posts) {
        await prisma.blogPost.create({
          data: {
            slug: p.id,
            title: p.title,
            excerpt: p.excerpt,
            category: p.category,
            author: p.author ?? "CiroStack Team",
            date: p.date,
            dateSort: new Date(p.dateSort),
            readMin: p.readMin,
            imageUrl: p.imageKey ? `/images/blog/blog-${p.imageKey.replace("img", "").toLowerCase().replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "")}.jpg` : null,
            featured: p.featured ?? false,
            published: true,
            tags: p.tags,
          },
        });
      }
      results.push(`Seeded ${posts.length} blog posts`);
    } else {
      results.push(`Blog already seeded (${blogCount} rows)`);
    }

    // ── Jobs ────────────────────────────────────────────────────────────
    const jobCount = await prisma.job.count();
    if (jobCount === 0) {
      const jobs = careersJson as {
        title: string;
        department: string;
        type: string;
        location: string;
        description: string;
      }[];

      for (const j of jobs) {
        await prisma.job.create({
          data: {
            title: j.title,
            department: j.department,
            type: j.type ?? "Full-Time",
            location: j.location ?? "Remote",
            description: j.description,
            active: true,
          },
        });
      }
      results.push(`Seeded ${jobs.length} jobs`);
    } else {
      results.push(`Jobs already seeded (${jobCount} rows)`);
    }

    return NextResponse.json({ message: results.join("; ") });
  } catch (err) {
    console.error("[POST /api/admin/seed-cms]", err);
    return NextResponse.json({ error: "Seed failed", details: String(err) }, { status: 500 });
  }
}
