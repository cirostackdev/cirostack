import { servicesData } from "@/data/services";
import { industriesData } from "@/data/industries-generated";
import { startupsData } from "@/data/startups";
import { projects } from "@/data/caseStudies";
import { posts } from "@/pages-src/BlogPost";

export type SearchCategory =
  | "Services"
  | "Industries"
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

export const searchIndex: SearchItem[] = [
  // Services
  ...Object.entries(servicesData).map(([slug, s]) => ({
    id: `services-${slug}`,
    title: s.title,
    subtitle: s.tagline,
    category: "Services" as const,
    href: `/services/${slug}`,
    keywords: [s.title, s.tagline, ...s.technologies].join(" ").toLowerCase(),
  })),

  // Industries
  ...Object.entries(industriesData).map(([slug, ind]) => ({
    id: `industries-${slug}`,
    title: ind.title,
    subtitle: ind.tagline,
    category: "Industries" as const,
    href: `/industries/${slug}`,
    keywords: [ind.title, ind.tagline, ind.parentCategory].join(" ").toLowerCase(),
  })),

  // Startups
  ...Object.entries(startupsData).map(([slug, s]) => ({
    id: `startups-${slug}`,
    title: s.title,
    subtitle: s.tagline,
    category: "Startups" as const,
    href: `/startups/${slug}`,
    keywords: [s.title, s.tagline, s.parentCategory].join(" ").toLowerCase(),
  })),

  // Case Studies
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
      ...p.technologies.flatMap((t) => t.tools),
    ]
      .join(" ")
      .toLowerCase(),
  })),

  // Blog
  ...Object.entries(posts).map(([slug, p]) => ({
    id: `blog-${slug}`,
    title: p.title,
    subtitle: p.category,
    category: "Blog" as const,
    href: `/blog/${slug}`,
    keywords: [p.title, p.category, ...p.tags].join(" ").toLowerCase(),
  })),
];
