import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Construction & Engineering Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Construction & Engineering industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/construction-and-engineering" },
  openGraph: {
    url: "https://cirostack.com/industries/construction-and-engineering",
    title: "Construction & Engineering Software Solutions | CiroStack",
    description:
      "Custom software for the Construction & Engineering industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Construction & Engineering" }],
  },
};

export default function ConstructionAndEngineeringPage() {
  return <IndustryCategory categoryId="construction-and-engineering" />;
}
