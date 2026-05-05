import type { Metadata } from "next";
import StartupCategory from "@/pages-src/StartupCategory";

export const metadata: Metadata = {
  title: "By Stage - Startup Software Solutions | CiroStack",
  description:
    "CiroStack builds custom software for startups. Explore our by stage offerings with fixed-price engagements and senior engineers.",
  alternates: { canonical: "https://cirostack.com/startups/by-stage" },
  openGraph: {
    url: "https://cirostack.com/startups/by-stage",
    title: "By Stage - Software for Startups | CiroStack",
    description:
      "Fixed-price startup software development. Senior engineers. Shipped in weeks.",
  },
};

export default function ByStagePage() {
  return <StartupCategory categoryId="by-stage" />;
}
