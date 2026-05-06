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
  // Services — include introSummary, deliverables, and industry expertise for richer matching
  ...Object.entries(servicesData).map(([slug, s]) => ({
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

  // Industries — include introSummary, description, and challenges
  ...Object.entries(industriesData).map(([slug, ind]) => ({
    id: `industries-${slug}`,
    title: ind.title,
    subtitle: ind.tagline,
    category: "Industries" as const,
    href: `/industries/${slug}`,
    keywords: [
      ind.title,
      ind.tagline,
      ind.parentCategory,
      ind.introSummary,
      ind.description,
      ...(ind.challenges ?? []),
    ]
      .join(" ")
      .toLowerCase(),
  })),

  // Startups — include introSummary and description
  ...Object.entries(startupsData).map(([slug, s]) => ({
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
