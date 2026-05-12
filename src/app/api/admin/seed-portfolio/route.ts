import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { projects } from "@/data/caseStudies";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const count = await prisma.portfolioProject.count();
    if (count > 0) {
      return NextResponse.json({ message: `Already seeded (${count} projects exist)`, skipped: true });
    }

    const entries = Object.entries(projects);
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
          imageUrl: null,
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

    return NextResponse.json({ message: `Seeded ${entries.length} portfolio projects`, count: entries.length });
  } catch (err) {
    console.error("[POST /api/admin/seed-portfolio]", err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
