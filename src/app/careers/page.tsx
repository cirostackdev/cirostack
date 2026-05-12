import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Careers from "@/pages-src/Careers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the CiroStack team. Open roles for engineers, designers, and product leaders.",
  alternates: { canonical: "https://cirostack.com/careers/" },
  openGraph: {
    url: "https://cirostack.com/careers/",
    title: "Build Software That Matters | Careers at CiroStack",
    description: "We're hiring senior engineers, designers, and product leaders who want to ship real products for real businesses. Remote-first, no busywork, high-impact work from day one.",
    images: [{ url: "https://cirostack.com/og/pages/careers.jpg", width: 1200, height: 630, alt: "Careers at CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Software That Matters | Careers at CiroStack",
    description: "We're hiring senior engineers, designers, and product leaders who want to ship real products for real businesses. Remote-first, no busywork, high-impact work from day one.",
    images: ["https://cirostack.com/og/pages/careers.jpg"],
  },
};

async function getJobs() {
  try {
    const jobs = await prisma.job.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
    return jobs;
  } catch {
    return null;
  }
}

export default async function CareersPage() {
  const jobs = await getJobs();
  return <Careers serverJobs={jobs} />;
}
