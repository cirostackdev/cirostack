import { NextResponse } from "next/server";

export const revalidate = 3600; // re-fetch at most once per hour

const QUERY = `startup OR "software development" OR "SaaS startup" OR fintech OR "AI automation" OR "tech startup" OR healthtech OR "software agency"`;

export async function GET() {
  const key = process.env.GNEWS_API_KEY;
  if (!key) {
    return NextResponse.json([]);
  }

  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(QUERY)}&lang=en&max=9&sortby=publishedAt&token=${key}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.error("[api/news] GNews responded:", res.status);
      return NextResponse.json([]);
    }

    const data = await res.json();
    const articles = (data.articles ?? []).map((a: Record<string, unknown>) => ({
      title: a.title,
      description: a.description,
      content: a.content,
      url: a.url,
      image: a.image,
      publishedAt: a.publishedAt,
      source: (a.source as { name: string })?.name ?? "Unknown",
      sourceUrl: (a.source as { url: string })?.url ?? null,
    }));

    return NextResponse.json(articles);
  } catch (err) {
    console.error("[api/news]", err);
    return NextResponse.json([]);
  }
}
