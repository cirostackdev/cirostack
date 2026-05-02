import type { Metadata } from "next";
import { Suspense } from "react";
import Portfolio from "@/pages-src/Portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Case studies from CiroStack — real projects across fintech, healthcare, e-commerce, SaaS, and more. See what we've built and the results it delivered.",
  alternates: { canonical: "https://cirostack.com/portfolio" },
  openGraph: {
    images: [{ url: "https://cirostack.com/og/pages/portfolio.jpg", width: 1200, height: 630, alt: "CiroStack Portfolio" }],
    url: "https://cirostack.com/portfolio",
    title: "Our Work — Case Studies from CiroStack",
    description:
      "Real projects, real results. See how we've built dashboards, apps, AI tools, and platforms for clients across fintech, healthcare, e-commerce, SaaS, and more — all fixed-price.",
  },
};

export default function PortfolioPage() {
  return (
    <Suspense fallback={null}>
      <Portfolio />
    </Suspense>
  );
}
