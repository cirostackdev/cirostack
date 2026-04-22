import type { MetadataRoute } from "next";
import { industriesData } from "@/data/industries-generated";

export const dynamic = 'force-static'

const SITE_URL = "https://cirostack.com";

const STATIC_PAGES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/portfolio", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/industries", priority: 0.8, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about/our-culture", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
] as const;

const SERVICE_SLUGS = [
  "websites",
  "apps",
  "ux-ui-design",
  "cloud-engineering",
  "dedicated-teams",
  "embedded-software",
  "cloud-consulting",
];

const BLOG_SLUGS = [
  "why-fixed-price",
  "ai-automation-guide",
  "react-vs-nextjs",
  "web-design-trends",
  "mvp-launch-checklist",
  "langchain-tutorial",
  "cloud-migration-kubernetes",
  "healthcare-digital-transformation",
  "cicd-devops-best-practices",
  "fintech-security-architecture",
  "design-system-scale",
  "headless-ecommerce-architecture",
  "ml-models-production",
  "outsourcing-vs-inhouse",
  "real-time-data-pipelines",
  "scaling-saas-post-funding",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const serviceEntries: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const industryEntries: MetadataRoute.Sitemap = Object.keys(industriesData).map((slug) => ({
    url: `${SITE_URL}/industries/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries, ...industryEntries];
}
