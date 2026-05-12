import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Dynamic import for the case studies data
async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL required");
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const count = await prisma.portfolioProject.count();
  if (count > 0) {
    console.log(`PortfolioProject table already has ${count} rows — skipping seed.`);
    await pool.end();
    return;
  }

  // Import the case studies from the static data file
  const { projects } = await import("../src/data/caseStudies");

  const entries = Object.entries(projects);
  console.log(`Seeding ${entries.length} portfolio projects...`);

  for (const [slug, p] of entries) {
    await prisma.portfolioProject.create({
      data: {
        slug,
        title: p.title,
        client: p.client,
        vertical: p.vertical,
        category: p.category,
        service: p.service,
        country: p.country || "",
        location: p.location || "",
        size: p.size || "",
        duration: p.duration || "",
        year: p.year || "",
        description: p.description,
        aboutClient: p.aboutClient || null,
        challenge: p.challenge || null,
        solution: p.solution || null,
        result: p.result || null,
        imageUrl: null, // Will use static images for now
        featured: false,
        published: true,
        keyFeatures: p.keyFeatures || null,
        metrics: p.metrics || null,
        technologies: p.technologies || null,
        process: p.process || null,
        whatClientLoved: p.whatClientLoved || null,
        challengesOvercome: p.challengesOvercome || null,
        testimonial: p.testimonial || null,
        relatedProjects: p.relatedProjects || null,
      },
    });
  }

  console.log(`Seeded ${entries.length} portfolio projects.`);
  await pool.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
