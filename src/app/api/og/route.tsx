import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

// ── Blog post lookup (includes image path for auto background) ───────────────
const POST_META: Record<string, { title: string; description: string; image: string }> = {
  "why-fixed-price": {
    title: "Why Fixed-Price Development Beats Hourly Billing",
    description: "How fixed-price engagements protect your runway, eliminate budget anxiety, and align incentives between your team and your development partner.",
    image: "/images/blog/blog-fixed-price.jpg",
  },
  "ai-automation-guide": {
    title: "How We Use OpenAI & LangChain to Automate Enterprise Workflows",
    description: "A practical guide to identifying high-ROI automation candidates and building reliable AI pipelines that run in production without babysitting.",
    image: "/images/blog/blog-ai-automation.jpg",
  },
  "react-vs-nextjs": {
    title: "React vs Next.js: A Decision Framework from 50+ Client Projects",
    description: "When to use React, when to use Next.js, and the questions to ask before picking a framework — drawn from 50+ real engagements.",
    image: "/images/blog/blog-react-nextjs.jpg",
  },
  "web-design-trends": {
    title: "UX Patterns That Drive Retention in SaaS Products",
    description: "The onboarding flows, dashboard patterns, and in-product nudges that measurably reduce churn and increase activation rates.",
    image: "/images/blog/blog-design-trends.jpg",
  },
  "mvp-launch-checklist": {
    title: "The MVP Launch Checklist: From Architecture to Analytics",
    description: "Every technical decision you need to make before shipping your first version — infrastructure, monitoring, error handling, and analytics.",
    image: "/images/blog/blog-mvp-launch.jpg",
  },
  "langchain-tutorial": {
    title: "Building a Production AI Chatbot with LangChain & Node.js",
    description: "Step-by-step guide to building a RAG-powered chatbot that handles real user queries without hallucinating — with retrieval, memory, and fallbacks.",
    image: "/images/blog/blog-langchain.jpg",
  },
  "cloud-migration-kubernetes": {
    title: "Migrating to Kubernetes on AWS: A Step-by-Step Playbook",
    description: "How we migrate production workloads to Kubernetes without downtime — from cluster setup to deployment pipelines and autoscaling.",
    image: "/images/blog/blog-cloud-migration.jpg",
  },
  "healthcare-digital-transformation": {
    title: "Digital Transformation in Healthcare: Building HIPAA-Compliant Platforms",
    description: "The technical controls, architecture decisions, and compliance workflows required to build healthcare software that passes a HIPAA audit.",
    image: "/images/blog/blog-healthcare-tech.jpg",
  },
  "cicd-devops-best-practices": {
    title: "CI/CD Pipelines That Actually Work: Our DevOps Toolkit",
    description: "The pipeline architecture, testing strategy, and deployment automation we use across client projects to enable multiple daily releases.",
    image: "/images/blog/blog-cicd-pipeline.jpg",
  },
  "fintech-security-architecture": {
    title: "Security-First Architecture for Fintech Applications",
    description: "How to design fintech systems with encryption, fraud detection, and regulatory compliance built in from day one — not bolted on later.",
    image: "/images/blog/blog-fintech-security.jpg",
  },
  "design-system-scale": {
    title: "Building a Design System That Scales Across Products",
    description: "How to create a component library that enforces visual consistency, speeds up development, and doesn't become a maintenance burden.",
    image: "/images/blog/blog-design-system.jpg",
  },
  "headless-ecommerce-architecture": {
    title: "Headless Commerce: Why Top Retailers Are Decoupling Their Frontends",
    description: "The business case for headless commerce, the architecture tradeoffs, and when a monolithic platform is actually the better choice.",
    image: "/images/blog/blog-ecommerce-headless.jpg",
  },
  "ml-models-production": {
    title: "From Jupyter Notebook to Production: Deploying ML Models That Last",
    description: "The gap between a working notebook and a production ML system — covering serving infrastructure, monitoring, drift detection, and retraining pipelines.",
    image: "/images/blog/blog-ml-production.jpg",
  },
  "outsourcing-vs-inhouse": {
    title: "Outsourcing vs In-House Development: An Honest Comparison",
    description: "When to build an internal team, when to outsource, and how to structure the engagement so you're not dependent on the vendor forever.",
    image: "/images/blog/blog-outsourcing-guide.jpg",
  },
  "real-time-data-pipelines": {
    title: "Building Real-Time Data Pipelines with Python and AWS",
    description: "How to architect streaming data pipelines using Kinesis, Lambda, and Python — with exactly-once processing and failure recovery built in.",
    image: "/images/blog/blog-data-pipeline.jpg",
  },
  "scaling-saas-post-funding": {
    title: "Scaling Your SaaS After Series A: Technical Decisions That Matter",
    description: "The infrastructure, hiring, and architecture decisions that determine whether your Series A round accelerates growth or gets consumed by tech debt.",
    image: "/images/blog/blog-scaling-startup.jpg",
  },
};

// ── Image cache (warm across requests in the same process instance) ──────────
const imageCache = new Map<string, string>();

function loadPublicImage(publicPath: string): string | null {
  if (imageCache.has(publicPath)) return imageCache.get(publicPath)!;
  try {
    const abs = join(process.cwd(), "public", publicPath);
    const buf = readFileSync(abs);
    const mime = publicPath.endsWith(".png") ? "image/png" : "image/jpeg";
    const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;
    imageCache.set(publicPath, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max - 1) + "…";
}

function titleFontSize(title: string): number {
  if (title.length > 70) return 42;
  if (title.length > 50) return 50;
  return 58;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  let title = searchParams.get("title") ?? "";
  let description = searchParams.get("description") ?? "";
  const label = searchParams.get("label") ?? "";
  let bgPath = searchParams.get("bg") ?? "";

  // Slug-based lookups — also auto-derive background when not explicitly set
  const postId = searchParams.get("post");
  const serviceSlug = searchParams.get("service");
  const industrySlug = searchParams.get("industry");

  if (postId) {
    const post = POST_META[postId];
    if (post) {
      title = post.title;
      description = post.description;
      if (!bgPath) bgPath = post.image;
    }
  } else if (serviceSlug) {
    const { servicesData } = await import("@/data/services");
    const svc = servicesData[serviceSlug];
    if (svc) {
      title = svc.title;
      description = svc.tagline;
      if (!bgPath) bgPath = "/images/pages/hero-services.jpg";
    }
  } else if (industrySlug) {
    const { industriesData } = await import("@/data/industries-generated");
    const ind = industriesData[industrySlug];
    if (ind) {
      title = ind.title;
      description = ind.tagline;
      if (!bgPath) bgPath = `/images/industries/hero-${industrySlug}.jpg`;
    }
  }

  if (!title) title = "CiroStack";
  if (!description) description = "Custom Software, Apps & AI for Growing Businesses";

  // Load assets
  const logoBuffer = readFileSync(join(process.cwd(), "src/assets/logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  const bgSrc = bgPath ? loadPublicImage(bgPath) : null;

  const fontSize = titleFontSize(title);

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
          fontFamily: "sans-serif",
        }}
      >
        {/* Background image */}
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

        {/* Dark overlay for readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: bgSrc
              ? "linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.40) 100%)"
              : "linear-gradient(135deg, rgba(229,57,53,0.10) 0%, rgba(13,17,23,0) 45%, rgba(124,58,237,0.10) 100%)",
          }}
        />

        {/* Bottom gradient fade for domain legibility */}
        {bgSrc ? (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "120px",
              background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)",
            }}
          />
        ) : null}

        {/* Red-to-purple bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #E53935 0%, #7C3AED 100%)",
          }}
        />

        {/* Content column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1",
            padding: "44px 64px 52px 72px",
          }}
        >
          {/* Top row — logo only, top-right */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "auto",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={96} height={96} alt="" />
          </div>

          {/* Middle — label + title + description */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1",
              justifyContent: "center",
            }}
          >
            {/* Label badge */}
            {label ? (
              <div style={{ display: "flex", marginBottom: "22px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(229,57,53,0.18)",
                    border: "1px solid rgba(229,57,53,0.50)",
                    borderRadius: "999px",
                    padding: "5px 18px",
                  }}
                >
                  <span
                    style={{
                      color: "#FF6B6B",
                      fontSize: "13px",
                      fontWeight: "700",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Title */}
            <div
              style={{
                color: "#FFFFFF",
                fontSize: `${fontSize}px`,
                fontWeight: "800",
                lineHeight: "1.18",
                marginBottom: "20px",
                maxWidth: "980px",
                textShadow: bgSrc ? "0 2px 8px rgba(0,0,0,0.6)" : "none",
              }}
            >
              {truncate(title, 90)}
            </div>

            {/* Description */}
            <div
              style={{
                color: bgSrc ? "rgba(255,255,255,0.85)" : "#9CA3AF",
                fontSize: "20px",
                lineHeight: "1.55",
                maxWidth: "860px",
                textShadow: bgSrc ? "0 1px 4px rgba(0,0,0,0.5)" : "none",
              }}
            >
              {truncate(description, 140)}
            </div>
          </div>

          {/* Bottom — domain */}
          <div style={{ display: "flex", marginTop: "auto" }}>
            <span
              style={{
                color: bgSrc ? "rgba(255,255,255,0.55)" : "#4B5563",
                fontSize: "15px",
                letterSpacing: "0.02em",
              }}
            >
              cirostack.com
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
