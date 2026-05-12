import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Portfolio from "@/pages-src/Portfolio";
import { HIDE_CASE_STUDIES } from "@/lib/feature-flags";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Case studies from CiroStack, real projects across fintech, healthcare, e-commerce, SaaS, and more. See what we've built and the results it delivered.",
  alternates: { canonical: "https://cirostack.com/portfolio/" },
  openGraph: {
    images: [{ url: "https://cirostack.com/og/pages/portfolio.jpg", width: 1200, height: 630, alt: "CiroStack Portfolio" }],
    url: "https://cirostack.com/portfolio/",
    title: "Our Work | Case Studies from CiroStack",
    description:
      "Real projects, real results. See how we've built dashboards, apps, AI tools, and platforms for clients across fintech, healthcare, e-commerce, SaaS, and more, all fixed-price.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work | Case Studies from CiroStack",
    description: "Real projects, real results. See how we've built dashboards, apps, AI tools, and platforms for clients across fintech, healthcare, e-commerce, SaaS, and more, all fixed-price.",
    images: ["https://cirostack.com/og/pages/portfolio.jpg"],
  },
};

async function getPortfolio() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/cms/portfolio`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function PortfolioPage() {
  if (HIDE_CASE_STUDIES) notFound();
  const serverProjects = await getPortfolio();
  return (
    <Suspense fallback={null}>
      <Portfolio serverProjects={serverProjects} />
    </Suspense>
  );
}
