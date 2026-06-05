import { NextResponse } from "next/server";

export const revalidate = 3600;

const GUARDIAN_QUERY = `startup OR SaaS OR "software development" OR fintech OR "AI automation" OR healthtech OR "tech startup"`;
const HN_QUERY = "startup software development SaaS AI fintech";

async function fetchGuardian(key: string) {
  const url = new URL("https://content.guardianapis.com/search");
  url.searchParams.set("q", GUARDIAN_QUERY);
  url.searchParams.set("section", "technology");
  url.searchParams.set("show-fields", "thumbnail,bodyText,trailText");
  url.searchParams.set("page-size", "15");
  url.searchParams.set("order-by", "newest");
  url.searchParams.set("api-key", key);

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) { console.error("[api/news] Guardian:", res.status); return []; }

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.response?.results ?? []).map((a: any) => ({
    title: a.webTitle as string,
    description: (a.fields?.trailText as string) ?? "",
    content: (a.fields?.bodyText as string) ?? "",
    url: a.webUrl as string,
    image: (a.fields?.thumbnail as string) ?? null,
    publishedAt: a.webPublicationDate as string,
    source: "The Guardian",
    sourceUrl: "https://theguardian.com",
    type: "guardian" as const,
  }));
}

async function fetchHackerNews() {
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(HN_QUERY)}&tags=story&hitsPerPage=15&numericFilters=points%3E10`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) { console.error("[api/news] HN:", res.status); return []; }

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.hits ?? []).filter((h: any) => !!h.url).map((h: any) => ({
    title: h.title as string,
    description: "",
    content: "",
    url: h.url as string,
    image: null,
    publishedAt: h.created_at as string,
    source: "Hacker News",
    sourceUrl: "https://news.ycombinator.com",
    type: "hackernews" as const,
    hnPoints: h.points as number,
    hnComments: h.num_comments as number,
    hnDiscussionUrl: `https://news.ycombinator.com/item?id=${h.objectID}`,
  }));
}

export async function GET() {
  try {
    const guardianKey = process.env.GUARDIAN_API_KEY;

    const [guardianResult, hnResult] = await Promise.allSettled([
      guardianKey ? fetchGuardian(guardianKey) : Promise.resolve([]),
      fetchHackerNews(),
    ]);

    const guardian = guardianResult.status === "fulfilled" ? guardianResult.value : [];
    const hn = hnResult.status === "fulfilled" ? hnResult.value : [];

    const all = [...guardian, ...hn].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return NextResponse.json(all.slice(0, 20));
  } catch (err) {
    console.error("[api/news]", err);
    return NextResponse.json([]);
  }
}
