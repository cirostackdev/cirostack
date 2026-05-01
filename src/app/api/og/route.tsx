import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

// ── Blog post lookup ────────────────────────────────────────────────────────
const POST_META: Record<string, { title: string; description: string }> = {
  "why-fixed-price": {
    title: "Why Fixed-Price Development Beats Hourly Billing",
    description:
      "How fixed-price engagements protect your runway, eliminate budget anxiety, and align incentives between your team and your development partner.",
  },
  "ai-automation-guide": {
    title: "How We Use OpenAI & LangChain to Automate Enterprise Workflows",
    description:
      "A practical guide to identifying high-ROI automation candidates and building reliable AI pipelines that run in production without babysitting.",
  },
  "react-vs-nextjs": {
    title: "React vs Next.js: A Decision Framework from 50+ Client Projects",
    description:
      "When to use React, when to use Next.js, and the questions to ask before picking a framework — drawn from 50+ real engagements.",
  },
  "web-design-trends": {
    title: "UX Patterns That Drive Retention in SaaS Products",
    description:
      "The onboarding flows, dashboard patterns, and in-product nudges that measurably reduce churn and increase activation rates.",
  },
  "mvp-launch-checklist": {
    title: "The MVP Launch Checklist: From Architecture to Analytics",
    description:
      "Every technical decision you need to make before shipping your first version — infrastructure, monitoring, error handling, and analytics.",
  },
  "langchain-tutorial": {
    title: "Building a Production AI Chatbot with LangChain & Node.js",
    description:
      "Step-by-step guide to building a RAG-powered chatbot that handles real user queries without hallucinating — with retrieval, memory, and fallbacks.",
  },
  "cloud-migration-kubernetes": {
    title: "Migrating to Kubernetes on AWS: A Step-by-Step Playbook",
    description:
      "How we migrate production workloads to Kubernetes without downtime — from cluster setup to deployment pipelines and autoscaling.",
  },
  "healthcare-digital-transformation": {
    title: "Digital Transformation in Healthcare: Building HIPAA-Compliant Platforms",
    description:
      "The technical controls, architecture decisions, and compliance workflows required to build healthcare software that passes a HIPAA audit.",
  },
  "cicd-devops-best-practices": {
    title: "CI/CD Pipelines That Actually Work: Our DevOps Toolkit",
    description:
      "The pipeline architecture, testing strategy, and deployment automation we use across client projects to enable multiple daily releases.",
  },
  "fintech-security-architecture": {
    title: "Security-First Architecture for Fintech Applications",
    description:
      "How to design fintech systems with encryption, fraud detection, and regulatory compliance built in from day one — not bolted on later.",
  },
  "design-system-scale": {
    title: "Building a Design System That Scales Across Products",
    description:
      "How to create a component library that enforces visual consistency, speeds up development, and doesn't become a maintenance burden.",
  },
  "headless-ecommerce-architecture": {
    title: "Headless Commerce: Why Top Retailers Are Decoupling Their Frontends",
    description:
      "The business case for headless commerce, the architecture tradeoffs, and when a monolithic platform is actually the better choice.",
  },
  "ml-models-production": {
    title: "From Jupyter Notebook to Production: Deploying ML Models That Last",
    description:
      "The gap between a working notebook and a production ML system — covering serving infrastructure, monitoring, drift detection, and retraining pipelines.",
  },
  "outsourcing-vs-inhouse": {
    title: "Outsourcing vs In-House Development: An Honest Comparison",
    description:
      "When to build an internal team, when to outsource, and how to structure the engagement so you're not dependent on the vendor forever.",
  },
  "real-time-data-pipelines": {
    title: "Building Real-Time Data Pipelines with Python and AWS",
    description:
      "How to architect streaming data pipelines using Kinesis, Lambda, and Python — with exactly-once processing and failure recovery built in.",
  },
  "scaling-saas-post-funding": {
    title: "Scaling Your SaaS After Series A: Technical Decisions That Matter",
    description:
      "The infrastructure, hiring, and architecture decisions that determine whether your Series A round accelerates growth or gets consumed by tech debt.",
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + "…";
}

function titleFontSize(title: string): number {
  if (title.length > 70) return 42;
  if (title.length > 50) return 50;
  return 58;
}

// ── Route handler ────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  let title = searchParams.get("title") ?? "";
  let description = searchParams.get("description") ?? "";
  const label = searchParams.get("label") ?? "";

  // Slug-based lookups — keeps metadata URLs short and avoids encoding issues
  const postId = searchParams.get("post");
  const serviceSlug = searchParams.get("service");
  const industrySlug = searchParams.get("industry");

  if (postId) {
    const post = POST_META[postId];
    if (post) {
      title = post.title;
      description = post.description;
    }
  } else if (serviceSlug) {
    // Lazy import to avoid loading on every request type
    const { servicesData } = await import("@/data/services");
    const svc = servicesData[serviceSlug];
    if (svc) {
      title = svc.title;
      description = svc.tagline;
    }
  } else if (industrySlug) {
    const { industriesData } = await import("@/data/industries-generated");
    const ind = industriesData[industrySlug];
    if (ind) {
      title = ind.title;
      description = ind.tagline;
    }
  }

  if (!title) title = "CiroStack";
  if (!description) description = "Custom Software, Apps & AI for Growing Businesses";

  // Load logo once per process (Node.js caches module-level operations)
  const logoBuffer = readFileSync(join(process.cwd(), "src/assets/logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  const fontSize = titleFontSize(title);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          background: "#0D1117",
          overflow: "hidden",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: "0",
            background:
              "linear-gradient(135deg, rgba(229,57,53,0.10) 0%, rgba(13,17,23,0) 45%, rgba(124,58,237,0.10) 100%)",
          }}
        />

        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "6px",
            height: "100%",
            background: "linear-gradient(180deg, #E53935 0%, #7C3AED 100%)",
          }}
        />

        {/* Content column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1",
            padding: "44px 64px 44px 80px",
          }}
        >
          {/* Top row — logo + wordmark right-aligned */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: "auto",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={48} height={48} alt="" style={{ marginRight: "12px" }} />
            <span
              style={{
                color: "#FFFFFF",
                fontSize: "20px",
                fontWeight: "700",
                letterSpacing: "-0.02em",
              }}
            >
              CiroStack
            </span>
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
                    background: "rgba(229,57,53,0.12)",
                    border: "1px solid rgba(229,57,53,0.40)",
                    borderRadius: "999px",
                    padding: "5px 18px",
                  }}
                >
                  <span
                    style={{
                      color: "#EF5350",
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
              }}
            >
              {truncate(title, 90)}
            </div>

            {/* Description */}
            <div
              style={{
                color: "#9CA3AF",
                fontSize: "20px",
                lineHeight: "1.55",
                maxWidth: "860px",
              }}
            >
              {truncate(description, 140)}
            </div>
          </div>

          {/* Bottom — domain */}
          <div style={{ display: "flex", marginTop: "auto" }}>
            <span
              style={{
                color: "#4B5563",
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
