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
  };
}

export default async function CaseStudyPage({ params }: Props) {
  void params;
  return <CaseStudy />;
}
