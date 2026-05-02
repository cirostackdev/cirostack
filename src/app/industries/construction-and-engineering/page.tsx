import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Construction & Engineering Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Construction & Engineering industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/construction-and-engineering" },
  openGraph: {
    url: "https://cirostack.com/industries/construction-and-engineering",
    title: "Software for Construction & Engineering — CiroStack",
    description:
      "Project management tools, bidding platforms, and field apps for contractors, construction companies, and engineering firms. We build software that keeps your projects on time and on budget.",
    images: [{ url: "https://cirostack.com/og/industries/construction-and-engineering.jpg", width: 1200, height: 630, alt: "CiroStack Construction And Engineering" }],
  },
};

export default function ConstructionAndEngineeringPage() {
  return <IndustryCategory categoryId="construction-and-engineering" />;
}
