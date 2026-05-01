import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";

export const runtime = "nodejs";

// ── Asset cache (warm across requests in same process instance) ──────────────
const assetCache = new Map<string, string>();

async function fetchAsDataUrl(url: string): Promise<string | null> {
  if (assetCache.has(url)) return assetCache.get(url)!;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const mime = url.endsWith(".png") ? "image/png" : "image/jpeg";
    const dataUrl = `data:${mime};base64,${Buffer.from(buf).toString("base64")}`;
    assetCache.set(url, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
}

// ── Blog post → background image map ────────────────────────────────────────
const POST_BG: Record<string, string> = {
  "why-fixed-price":                  "/images/blog/blog-fixed-price.jpg",
  "ai-automation-guide":              "/images/blog/blog-ai-automation.jpg",
  "react-vs-nextjs":                  "/images/blog/blog-react-nextjs.jpg",
  "web-design-trends":                "/images/blog/blog-design-trends.jpg",
  "mvp-launch-checklist":             "/images/blog/blog-mvp-launch.jpg",
  "langchain-tutorial":               "/images/blog/blog-langchain.jpg",
  "cloud-migration-kubernetes":       "/images/blog/blog-cloud-migration.jpg",
  "healthcare-digital-transformation":"/images/blog/blog-healthcare-tech.jpg",
  "cicd-devops-best-practices":       "/images/blog/blog-cicd-pipeline.jpg",
  "fintech-security-architecture":    "/images/blog/blog-fintech-security.jpg",
  "design-system-scale":              "/images/blog/blog-design-system.jpg",
  "headless-ecommerce-architecture":  "/images/blog/blog-ecommerce-headless.jpg",
  "ml-models-production":             "/images/blog/blog-ml-production.jpg",
  "outsourcing-vs-inhouse":           "/images/blog/blog-outsourcing-guide.jpg",
  "real-time-data-pipelines":         "/images/blog/blog-data-pipeline.jpg",
  "scaling-saas-post-funding":        "/images/blog/blog-scaling-startup.jpg",
};

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  // Explicit background path
  let bgPath = searchParams.get("bg") ?? "";

  // Slug-based auto-derive
  const postId       = searchParams.get("post");
  const serviceSlug  = searchParams.get("service");
  const industrySlug = searchParams.get("industry");

  if (postId && !bgPath) {
    bgPath = POST_BG[postId] ?? "/images/pages/hero-blog.jpg";
  } else if (serviceSlug && !bgPath) {
    bgPath = "/images/pages/hero-services.jpg";
  } else if (industrySlug && !bgPath) {
    bgPath = `/images/industries/hero-${industrySlug}.jpg`;
  }

  // Fetch assets in parallel
  const [logoSrc, bgSrc] = await Promise.all([
    fetchAsDataUrl(`${origin}/logo.png`),
    bgPath ? fetchAsDataUrl(`${origin}${bgPath}`) : Promise.resolve(null),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          position: "relative",
          overflow: "hidden",
          background: "#0D1117",
        }}
      >
        {/* Background image — full bleed */}
        {bgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bgSrc}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1200px",
              height: "630px",
              objectFit: "cover",
            }}
          />
        ) : null}

        {/* Logo — top-left, 96×96 */}
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoSrc}
            alt=""
            style={{
              position: "absolute",
              top: "36px",
              left: "48px",
              width: "96px",
              height: "96px",
            }}
          />
        ) : null}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // Cache at CDN for 7 days — scrapers (WhatsApp, Twitter, etc.) get
        // a near-instant response after the first hit warms the cache.
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
      },
    }
  );
}
