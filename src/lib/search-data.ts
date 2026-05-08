import { servicesData } from "@/data/services";
import { startupsData } from "@/data/startups";
import { projects } from "@/data/caseStudies";
import { posts } from "@/pages-src/BlogPost";

export type SearchCategory =
  | "Services"
  | "Startups"
  | "Case Studies"
  | "Blog";

export type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  href: string;
  keywords: string;
};

const VALID_SERVICE_SLUGS = new Set([
  "website-development", "frontend-development", "backend-development", "apps",
  "ai", "ux-ui-design", "cloud-consulting", "startup-branding",
  "dedicated-teams", "ai-ml", "devops", "software-auditing",
  "cto-as-a-service", "nearshore", "outsourcing",
]);

const VALID_STARTUP_SLUGS = new Set([
  // by-stage
  "pre-idea", "validation", "mvp", "early-traction", "seed-stage", "growth", "scale-up",
  // by-vertical
  "fintech", "healthtech", "edtech", "proptech", "legaltech",
  "ai-startup", "logistics-tech", "ecommerce", "b2b-saas", "consumer-apps",
  // by-product
  "web-app", "mobile-app", "ai-product", "saas-platform", "marketplace", "api-product",
  // by-founder
  "non-technical-founder", "first-time-founder", "solo-founder", "repeat-founder",
  "student-startup", "corporate-innovator", "female-led", "african-startup",
  "diaspora-founder", "social-enterprise",
  // by-challenge
  "fast-mvp", "scaling-tech", "agency-rescue", "fundraising-ready",
  "ai-integration", "tech-debt", "post-pivot", "no-tech-team", "africa-launch",
]);

export const searchIndex: SearchItem[] = [
  // Services — include introSummary, deliverables, and industry expertise for richer matching
  ...Object.entries(servicesData)
    .filter(([slug]) => VALID_SERVICE_SLUGS.has(slug))
    .map(([slug, s]) => ({
    id: `services-${slug}`,
    title: s.title,
    subtitle: s.tagline,
    category: "Services" as const,
    href: `/services/${slug}`,
    keywords: [
      s.title,
      s.tagline,
      s.introSummary,
      ...s.technologies,
      ...s.deliverables,
      ...(s.industryExpertise ?? []),
    ]
      .join(" ")
      .toLowerCase(),
  })),

  // Startups — include introSummary and description
  ...Object.entries(startupsData)
    .filter(([slug]) => VALID_STARTUP_SLUGS.has(slug))
    .map(([slug, s]) => ({
    id: `startups-${slug}`,
    title: s.title,
    subtitle: s.tagline,
    category: "Startups" as const,
    href: `/startups/${slug}`,
    keywords: [
      s.title,
      s.tagline,
      s.parentCategory,
      s.introSummary,
      s.description,
    ]
      .join(" ")
      .toLowerCase(),
  })),

  // Case Studies — include description, service, challenge, and solution
  ...Object.entries(projects).map(([slug, p]) => ({
    id: `portfolio-${slug}`,
    title: p.title,
    subtitle: `${p.client} — ${p.industry}`,
    category: "Case Studies" as const,
    href: `/portfolio/${slug}`,
    keywords: [
      p.title,
      p.client,
      p.industry,
      p.category,
      p.service,
      p.description,
      p.challenge,
      p.solution,
      ...p.technologies.flatMap((t) => t.tools),
    ]
      .join(" ")
      .toLowerCase(),
  })),

  // Blog — include author and first paragraph text for content-based matching
  ...Object.entries(posts).map(([slug, p]) => {
    const firstParagraph =
      (p.content.find((b) => b.type === "paragraph") as { type: "paragraph"; text: string } | undefined)?.text ?? "";
    return {
      id: `blog-${slug}`,
      title: p.title,
      subtitle: `${p.category} · ${p.author}`,
      category: "Blog" as const,
      href: `/blog/${slug}`,
      keywords: [
        p.title,
        p.category,
        p.author,
        ...p.tags,
        firstParagraph.slice(0, 300),
      ]
        .join(" ")
        .toLowerCase(),
    };
  }),
];
