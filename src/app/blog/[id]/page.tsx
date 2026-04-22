import type { Metadata } from "next";
import BlogPostPage from "@/pages-src/BlogPost";

type Props = { params: Promise<{ id: string }> };

// Minimal blog metadata table — avoids importing the client component's full data
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

export async function generateStaticParams() {
  return Object.keys(POST_META).map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = POST_META[id];
  if (!post) return { title: "Blog | CiroStack" };

  const ogImage = `https://cirostack.com${post.image}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://cirostack.com/blog/${id}` },
    openGraph: {
      type: "article",
      url: `https://cirostack.com/blog/${id}`,
      title: post.title,
      description: post.description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      siteName: "CiroStack",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostRoute({ params }: Props) {
  void params;
  return <BlogPostPage />;
}
