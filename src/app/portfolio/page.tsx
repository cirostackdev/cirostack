import type { Metadata } from "next";
import { Suspense } from "react";
import Portfolio from "@/pages-src/Portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Case studies from CiroStack — real projects across fintech, healthcare, e-commerce, SaaS, and more. See what we've built and the results it delivered.",
  alternates: { canonical: "https://cirostack.com/portfolio" },
  openGraph: {
    images: [{ url: "https://cirostack.com/images/pages/hero-portfolio.jpg", width: 1200, height: 630, alt: "CiroStack" }],
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
