import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { events } from "@/data/events";

// Resources data (from src/pages-src/Resources.tsx)
const resourcesData = [
  {
    slug: "ai-automation-guide-smbs",
    type: "Whitepaper",
    title: "The Complete Guide to AI Automation for SMBs",
    description: "Everything you need to know about implementing AI automation in your business: from strategy to execution.",
    pages: "42 pages",
    tags: ["AI", "Automation", "Strategy"],
    isNew: true,
  },
  {
    slug: "website-performance-playbook",
    type: "Guide",
    title: "Website Performance Optimization Playbook",
    description: "Improve your Core Web Vitals, SEO score, and conversion rate with proven tactics from our engineering team.",
    pages: "28 pages",
    tags: ["Web", "Performance", "SEO"],
    isNew: false,
  },
  {
    slug: "software-project-brief-template",
    type: "Template",
    title: "Software Project Brief Template",
    description: "Define your requirements clearly and get better quotes from any development partner.",
    pages: "8 pages",
    tags: ["Project Management", "Template"],
    isNew: false,
  },
  {
    slug: "cloud-migration-strategy",
    type: "Whitepaper",
    title: "Cloud Migration Strategy: A Technical Deep Dive",
    description: "A step-by-step technical guide to migrating your legacy infrastructure to modern cloud platforms.",
    pages: "56 pages",
    tags: ["Cloud", "DevOps"],
    isNew: true,
  },
  {
    slug: "building-first-mvp",
    type: "Guide",
    title: "Building Your First MVP: Lessons from 50+ Projects",
    description: "Distilled insights from helping over 50 startups launch their first product.",
    pages: "34 pages",
    tags: ["MVP", "Startups"],
    isNew: false,
  },
  {
    slug: "generative-ai-enterprise",
    type: "Webinar",
    title: "Generative AI in Enterprise: Real-World Applications",
    description: "A recorded webinar discussing practical enterprise AI applications beyond the hype.",
    pages: "60 min",
    tags: ["AI", "Enterprise", "Video"],
    isNew: true,
  },
];

// Announcements data (from src/pages-src/Newsroom.tsx)
const announcementsData = [
  {
    slug: "seed-round",
    type: "Press Release",
    title: "CiroStack Raises $2.5M Seed Round to Accelerate AI-Powered Development",
    summary: "CiroStack today announced the close of its $2.5 million seed funding round led by Horizon Ventures, with participation from several top angel investors in the enterprise software space.",
    body: "CiroStack today announced the close of its $2.5 million seed funding round led by Horizon Ventures, with participation from several top angel investors in the enterprise software space. The funds will be used to expand the engineering team, deepen AI capabilities, and grow the company's client base across North America and Africa. \"This investment validates what we've always believed: that transparent, fixed-price software development is the future,\" said the CiroStack CEO. \"We're building infrastructure for the next generation of software-driven businesses.\"",
    date: "February 20, 2026",
    tag: "Funding",
    featured: true,
  },
  {
    slug: "top-agency-award",
    type: "Award",
    title: "CiroStack Named 'Top Software Development Agency' by TechReview Annual Report",
    summary: "For the second consecutive year, CiroStack has been recognized as a top-tier software development agency for client satisfaction, delivery speed, and innovation.",
    body: "For the second consecutive year, CiroStack has been recognized as a top-tier software development agency by TechReview's Annual Report, which evaluates over 500 agencies globally on client satisfaction, on-time delivery, pricing transparency, and technical innovation. The recognition reflects CiroStack's fixed-price delivery model and its track record of zero budget overruns across 50+ client projects. \"Winning this two years in a row tells us we're doing the right things,\" said the Head of Delivery. \"Our clients trust us because we make and keep our promises.\"",
    date: "January 15, 2026",
    tag: "Recognition",
    featured: true,
  },
  {
    slug: "forbes-feature",
    type: "Media Coverage",
    title: "Forbes: 'How CiroStack is Democratizing Enterprise Software'",
    summary: "A Forbes feature on how CiroStack is making enterprise-quality software development accessible to growing businesses with its fixed-price, transparent model.",
    body: null,
    date: "December 10, 2025",
    source: "Forbes",
    tag: "Media",
    featured: false,
    url: "https://forbes.com",
  },
  {
    slug: "aws-partnership",
    type: "Partnership",
    title: "CiroStack Partners with AWS to Offer Certified Cloud Migration Services",
    summary: "CiroStack is now an official AWS Partner, enabling us to offer certified cloud migration and infrastructure services to our growing base of enterprise clients.",
    body: null,
    date: "November 28, 2025",
    tag: "Partnership",
    featured: false,
  },
  {
    slug: "ai-division",
    type: "Press Release",
    title: "CiroStack Launches AI Development Services Division",
    summary: "CiroStack formally launched its AI & Machine Learning development services division, expanding capabilities to serve clients seeking intelligent automation solutions.",
    body: null,
    date: "October 5, 2025",
    tag: "Product",
    featured: false,
  },
  {
    slug: "techcrunch-feature",
    type: "Media Coverage",
    title: "TechCrunch: 'Meet the Agency Disrupting Enterprise Software Delivery'",
    summary: "TechCrunch profiles CiroStack's unique approach to fixed-price software development and how it's winning over Fortune 500 clients.",
    body: null,
    date: "September 22, 2025",
    source: "TechCrunch",
    tag: "Media",
    featured: false,
    url: "https://techcrunch.com",
  },
];

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results: string[] = [];

  try {
    // ── Events ────────────────────────────────────────────────────────────
    const eventCount = await prisma.event.count();
    if (eventCount === 0) {
      for (const e of events) {
        await prisma.event.create({
          data: {
            slug: e.id,
            type: e.type,
            title: e.title,
            description: e.description,
            date: e.date,
            time: e.time,
            location: e.location,
            attendees: e.attendees,
            featured: e.featured,
            published: true,
            registrationUrl: e.registrationUrl,
          },
        });
      }
      results.push(`Seeded ${events.length} events`);
    } else {
      results.push(`Events already seeded (${eventCount} rows)`);
    }

    // ── Resources ─────────────────────────────────────────────────────────
    const resourceCount = await prisma.resource.count();
    if (resourceCount === 0) {
      for (const r of resourcesData) {
        await prisma.resource.create({
          data: {
            slug: r.slug,
            type: r.type,
            title: r.title,
            description: r.description,
            pages: r.pages,
            tags: r.tags,
            isNew: r.isNew,
            published: true,
          },
        });
      }
      results.push(`Seeded ${resourcesData.length} resources`);
    } else {
      results.push(`Resources already seeded (${resourceCount} rows)`);
    }

    // ── Announcements ─────────────────────────────────────────────────────
    const announcementCount = await prisma.announcement.count();
    if (announcementCount === 0) {
      for (const a of announcementsData) {
        await prisma.announcement.create({
          data: {
            slug: a.slug,
            type: a.type,
            title: a.title,
            summary: a.summary,
            body: a.body || null,
            date: a.date,
            source: (a as any).source || null,
            tag: a.tag,
            featured: a.featured,
            published: true,
            url: (a as any).url || null,
          },
        });
      }
      results.push(`Seeded ${announcementsData.length} announcements`);
    } else {
      results.push(`Announcements already seeded (${announcementCount} rows)`);
    }

    return NextResponse.json({ message: results.join("; ") });
  } catch (err) {
    console.error("[POST /api/admin/seed-content]", err);
    return NextResponse.json({ error: "Seed failed", details: String(err) }, { status: 500 });
  }
}
