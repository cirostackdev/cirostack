import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Category keyword mappings for content-based filtering
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  ai: ["AI", "machine learning", "LLM", "GPT", "neural", "automation", "Anthropic", "OpenAI", "Claude"],
  startups: ["startup", "venture", "fundrais", "seed round", "Series A", "Series B", "Series C", "YC", "accelerator"],
  fintech: ["fintech", "payment", "banking", "crypto", "blockchain", "neobank"],
  security: ["security", "hack", "breach", "ransomware", "cyber", "privacy", "vulnerability"],
  software: ["software", "SaaS", "app", "developer", "devtools", "API", "cloud computing"],
  enterprise: ["enterprise", "data center", "cloud", "Microsoft", "Google Cloud", "AWS", "infrastructure"],
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "30", 10)));
    const type = searchParams.get("type"); // "guardian" | "techcrunch" | null (all)
    const category = searchParams.get("category"); // "ai" | "startups" | "fintech" | "security" | "software" | "enterprise" | null

    // Build the where clause
    let where: any = {};

    // Type filter (source-based)
    if (type) {
      where.type = type;
    }

    // Category filter (keyword-based)
    if (category && CATEGORY_KEYWORDS[category]) {
      const keywords = CATEGORY_KEYWORDS[category];
      where.OR = keywords.flatMap(keyword => [
        { title: { contains: keyword } },
        { description: { contains: keyword } },
      ]);
    }

    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.newsArticle.count({ where }),
    ]);

    // Map to the shape the frontend expects
    const mapped = articles.map(a => ({
      title: a.title,
      description: a.description,
      content: a.content,
      url: a.url,
      image: a.image,
      publishedAt: a.publishedAt.toISOString(),
      source: a.source,
      sourceUrl: a.sourceUrl,
      type: a.type,
    }));

    return NextResponse.json({
      articles: mapped,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[api/news]", err);
    return NextResponse.json({ articles: [], pagination: { page: 1, limit: 30, total: 0, pages: 0 } });
  }
}
