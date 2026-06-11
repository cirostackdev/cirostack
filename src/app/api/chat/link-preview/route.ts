import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  try {
    new URL(url); // validate
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "bot" },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return NextResponse.json({ error: "Failed to fetch" }, { status: 502 });

    const html = await res.text();

    const getMetaContent = (property: string): string | null => {
      // Match both property="..." and name="..."
      const regex = new RegExp(
        `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']|<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`,
        "i"
      );
      const match = html.match(regex);
      return match?.[1] || match?.[2] || null;
    };

    const decodeEntities = (str: string | null): string | null => {
      if (!str) return null;
      return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
    };

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);

    const og = {
      title: decodeEntities(getMetaContent("og:title") || getMetaContent("twitter:title") || titleMatch?.[1]?.trim() || null),
      description: decodeEntities(getMetaContent("og:description") || getMetaContent("twitter:description") || getMetaContent("description") || null),
      image: getMetaContent("og:image") || getMetaContent("twitter:image") || null,
      siteName: decodeEntities(getMetaContent("og:site_name") || null),
      url,
    };

    // Resolve relative image URLs
    if (og.image && !og.image.startsWith("http")) {
      const base = new URL(url);
      og.image = new URL(og.image, base.origin).href;
    }

    return NextResponse.json(og, {
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 502 });
  }
}
