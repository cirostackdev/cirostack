import type { Metadata } from "next";
import { projects } from "@/data/caseStudies";
import CaseStudy from "@/pages-src/CaseStudy";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return Object.keys(projects).map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = projects[id];
  if (!project) return { title: "Case Study | CiroStack" };
  return {
    title: `${project.title} - Case Study | CiroStack`,
    description: project.description,
    alternates: { canonical: `https://cirostack.com/portfolio/${id}` },
    openGraph: {
      url: `https://cirostack.com/portfolio/${id}`,
      title: `${project.title} - Case Study | CiroStack`,
      description: project.description,
      images: [{ url: `https://cirostack.com/og/portfolio/${id}.jpg`, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - Case Study | CiroStack`,
      description: project.description,
      images: [`https://cirostack.com/og/portfolio/${id}.jpg`],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  void params;
  return <CaseStudy />;
}
