import type { Metadata } from "next";
import StartupCategory from "@/pages-src/StartupCategory";

export const metadata: Metadata = {
  title: "By Vertical - Startup Software Solutions | CiroStack",
  description:
    "CiroStack builds custom software for startups. Explore our by vertical offerings with fixed-price engagements and senior engineers.",
  alternates: { canonical: "https://cirostack.com/startups/by-vertical" },
  openGraph: {
    url: "https://cirostack.com/startups/by-vertical",
    title: "By Vertical - Software for Startups | CiroStack",
    description:
      "Fixed-price startup software development. Senior engineers. Shipped in weeks.",
  },
};

export default function ByVerticalPage() {
  return <StartupCategory categoryId="by-vertical" />;
}
