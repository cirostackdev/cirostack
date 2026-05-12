import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Blog posts ─────────────────────────────────────────────────────────────
  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0) {
    const raw = readFileSync(
      join(process.cwd(), "public/content/blog-posts.json"),
      "utf-8"
    );
    const posts = JSON.parse(raw) as {
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
          featured: p.featured ?? false,
          published: true,
          tags: p.tags,
        },
      });
    }
    console.log(`Seeded ${posts.length} blog posts`);
  } else {
    console.log(`Blog posts already seeded (${blogCount} rows), skipping`);
  }

  // ── Jobs ───────────────────────────────────────────────────────────────────
  const jobCount = await prisma.job.count();
  if (jobCount === 0) {
    const raw = readFileSync(
      join(process.cwd(), "public/content/careers.json"),
      "utf-8"
    );
    const jobs = JSON.parse(raw) as {
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
    console.log(`Seeded ${jobs.length} jobs`);
  } else {
    console.log(`Jobs already seeded (${jobCount} rows), skipping`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
