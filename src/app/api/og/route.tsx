import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

// ── Image cache (warm across requests in same process instance) ──────────────
const imageCache = new Map<string, string>();

function loadPublicImage(publicPath: string): string | null {
  if (imageCache.has(publicPath)) return imageCache.get(publicPath)!;
  try {
    const buf = readFileSync(join(process.cwd(), "public", publicPath));
    const mime = publicPath.endsWith(".png") ? "image/png" : "image/jpeg";
    const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;
    imageCache.set(publicPath, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
}

// ── Auto-derive background for slug-based lookups ────────────────────────────
// Post slugs → blog image paths
const POST_BG: Record<string, string> = {
  "why-fixed-price":                 "/images/blog/blog-fixed-price.jpg",
  "ai-automation-guide":             "/images/blog/blog-ai-automation.jpg",
  "react-vs-nextjs":                 "/images/blog/blog-react-nextjs.jpg",
  "web-design-trends":               "/images/blog/blog-design-trends.jpg",
  "mvp-launch-checklist":            "/images/blog/blog-mvp-launch.jpg",
  "langchain-tutorial":              "/images/blog/blog-langchain.jpg",
  "cloud-migration-kubernetes":      "/images/blog/blog-cloud-migration.jpg",
  "healthcare-digital-transformation":"/images/blog/blog-healthcare-tech.jpg",
  "cicd-devops-best-practices":      "/images/blog/blog-cicd-pipeline.jpg",
  "fintech-security-architecture":   "/images/blog/blog-fintech-security.jpg",
  "design-system-scale":             "/images/blog/blog-design-system.jpg",
  "headless-ecommerce-architecture": "/images/blog/blog-ecommerce-headless.jpg",
  "ml-models-production":            "/images/blog/blog-ml-production.jpg",
  "outsourcing-vs-inhouse":          "/images/blog/blog-outsourcing-guide.jpg",
  "real-time-data-pipelines":        "/images/blog/blog-data-pipeline.jpg",
  "scaling-saas-post-funding":       "/images/blog/blog-scaling-startup.jpg",
};

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Explicit background path (for static pages)
  let bgPath = searchParams.get("bg") ?? "";

  // Slug-based auto-derive
  const postId      = searchParams.get("post");
  const serviceSlug = searchParams.get("service");
  const industrySlug = searchParams.get("industry");

  if (postId && !bgPath) {
    bgPath = POST_BG[postId] ?? "/images/pages/hero-blog.jpg";
  } else if (serviceSlug && !bgPath) {
    bgPath = "/images/pages/hero-services.jpg";
  } else if (industrySlug && !bgPath) {
    bgPath = `/images/industries/hero-${industrySlug}.jpg`;
  }

  // Load assets
  const logoBuffer = readFileSync(join(process.cwd(), "src/assets/logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  const bgSrc = bgPath ? loadPublicImage(bgPath) : null;

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
