import { NextResponse } from "next/server";

export const revalidate = 3600;

const GUARDIAN_QUERY = `startup OR SaaS OR "software development" OR fintech OR "AI automation" OR healthtech OR "tech startup"`;
const HN_QUERY = "startup software development SaaS AI fintech";

type GuardianArticle = {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: string;
  sourceUrl: string | null;
  type: "guardian";
};

type HNArticle = {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: string;
  sourceUrl: string | null;
  type: "hackernews";
  hnPoints: number;
  hnComments: number;
  hnDiscussionUrl: string;
};

type Article = GuardianArticle | HNArticle;

// ── Helpers ─────────────────────────────────────────────────────────────────

function extractMainImage(mainHtml: string, thumbnail: string | null): string | null {
  const match = mainHtml.match(/src="([^"]+)"/);
  return match?.[1] ?? thumbnail ?? null;
}

function extractGuardianLinks(html: string): string[] {
  const regex = /href="(https?:\/\/(?:www\.)?theguardian\.com\/[^"]+)"/g;
  const links: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    const url = m[1];
    // Only article links (not tag pages, profiles, etc.)
    if (url.includes("/commentisfree/") || url.includes("/technology/") ||
        url.includes("/business/") || url.includes("/science/") ||
        url.includes("/world/") || url.includes("/uk-news/") ||
        url.includes("/us-news/") || url.includes("/environment/") ||
        url.includes("/money/") || url.includes("/global-development/")) {
      links.push(url);
    }
  }
  return [...new Set(links)];
}

function guardianPathFromUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\//, "").replace(/\/$/, "");
  } catch {
    return "";
  }
}

function rewriteGuardianLinks(html: string, availableUrls: Set<string>): string {
  return html.replace(
    /href="(https?:\/\/(?:www\.)?theguardian\.com\/[^"]+)"/g,
    (match, url) => {
      if (availableUrls.has(url)) {
        return `href="/newsroom/article?src=${encodeURIComponent(url)}"`;
      }
      return match;
    }
  );
}

// ── Fetchers ────────────────────────────────────────────────────────────────

function mapGuardianResult(a: any): GuardianArticle {
  const mainHtml = (a.fields?.main as string) ?? "";
  const mainImage = extractMainImage(mainHtml, (a.fields?.thumbnail as string) ?? null);

  return {
    title: a.webTitle as string,
    description: (a.fields?.trailText as string) ?? "",
    content: (a.fields?.body as string) ?? "",
    url: a.webUrl as string,
    image: mainImage,
    publishedAt: a.webPublicationDate as string,
    source: "The Guardian",
    sourceUrl: "https://theguardian.com",
    type: "guardian" as const,
  };
}

async function fetchGuardian(key: string): Promise<GuardianArticle[]> {
  const url = new URL("https://content.guardianapis.com/search");
  url.searchParams.set("q", GUARDIAN_QUERY);
  url.searchParams.set("section", "technology");
  url.searchParams.set("show-fields", "thumbnail,body,trailText,main");
  url.searchParams.set("page-size", "15");
  url.searchParams.set("order-by", "newest");
  url.searchParams.set("api-key", key);

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) { console.error("[api/news] Guardian:", res.status); return []; }

  const data = await res.json();
  return (data.response?.results ?? []).map(mapGuardianResult);
}

async function fetchGuardianByPath(key: string, path: string): Promise<GuardianArticle | null> {
  const url = new URL(`https://content.guardianapis.com/${path}`);
  url.searchParams.set("show-fields", "thumbnail,body,trailText,main");
  url.searchParams.set("api-key", key);

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const data = await res.json();
  const content = data.response?.content;
  if (!content) return null;
  return mapGuardianResult(content);
}

async function fetchLinkedGuardianArticles(
  key: string,
  primaryArticles: GuardianArticle[]
): Promise<GuardianArticle[]> {
  // Collect all Guardian links from all primary article bodies
  const primaryUrls = new Set(primaryArticles.map(a => a.url));
  const linkedUrls: string[] = [];

  for (const article of primaryArticles) {
    const links = extractGuardianLinks(article.content);
    for (const link of links) {
      if (!primaryUrls.has(link) && !linkedUrls.includes(link)) {
        linkedUrls.push(link);
      }
    }
  }

  // Cap at 20 linked articles to avoid excessive API calls
  const toFetch = linkedUrls.slice(0, 20);

  // Fetch in parallel with concurrency limit (5 at a time)
  const linked: GuardianArticle[] = [];
  for (let i = 0; i < toFetch.length; i += 5) {
    const batch = toFetch.slice(i, i + 5);
    const results = await Promise.allSettled(
      batch.map(url => {
        const path = guardianPathFromUrl(url);
        return path ? fetchGuardianByPath(key, path) : Promise.resolve(null);
      })
    );
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        linked.push(r.value);
      }
    }
  }

  return linked;
}

async function fetchHackerNews(): Promise<HNArticle[]> {
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(HN_QUERY)}&tags=story&hitsPerPage=15&numericFilters=points%3E10`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) { console.error("[api/news] HN:", res.status); return []; }

  const data = await res.json();
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

// ── Main handler ────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const guardianKey = process.env.GUARDIAN_API_KEY;

    const [guardianResult, hnResult] = await Promise.allSettled([
      guardianKey ? fetchGuardian(guardianKey) : Promise.resolve([]),
      fetchHackerNews(),
    ]);

    const guardian = guardianResult.status === "fulfilled" ? guardianResult.value : [];
    const hn = hnResult.status === "fulfilled" ? hnResult.value : [];

    // Fetch linked Guardian articles (1 level deep)
    let linkedGuardian: GuardianArticle[] = [];
    if (guardianKey && guardian.length > 0) {
      linkedGuardian = await fetchLinkedGuardianArticles(guardianKey, guardian);
    }

    // Build set of all available Guardian URLs for link rewriting
    const allGuardian = [...guardian, ...linkedGuardian];
    const availableUrls = new Set(allGuardian.map(a => a.url));

    // Rewrite internal Guardian links to point to our platform
    for (const article of allGuardian) {
      if (article.content) {
        article.content = rewriteGuardianLinks(article.content, availableUrls);
      }
    }

    // Combine, sort by date, and return
    const all: Article[] = [...allGuardian, ...hn].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return NextResponse.json(all);
  } catch (err) {
    console.error("[api/news]", err);
    return NextResponse.json([]);
  }
}
