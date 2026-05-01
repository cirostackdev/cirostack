import type { Metadata } from "next";
import { Suspense } from "react";
import Portfolio from "@/pages-src/Portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Case studies from CiroStack — real projects across fintech, healthcare, e-commerce, SaaS, and more. See what we've built and the results it delivered.",
  alternates: { canonical: "https://cirostack.com/portfolio" },
  openGraph: {
    images: [{ url: `https://cirostack.com/api/og?title=${encodeURIComponent("Portfolio | CiroStack")}&description=${encodeURIComponent("Real projects, real results. Browse case studies across fintech, healthcare, SaaS, e-commerce, and more.")}&label=${encodeURIComponent("Portfolio")}`, width: 1200, height: 630, alt: "CiroStack Portfolio" }],
    url: "https://cirostack.com/portfolio",
    title: "Portfolio | CiroStack",
    description:
      "Real projects, real results. Browse case studies across fintech, healthcare, SaaS, e-commerce, and more.",
  },
};

export default function PortfolioPage() {
  return (
    <Suspense fallback={null}>
      <Portfolio />
    </Suspense>
  );
}
