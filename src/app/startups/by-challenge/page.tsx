import type { Metadata } from "next";
import StartupCategory from "@/pages-src/StartupCategory";

export const metadata: Metadata = {
  title: "By Challenge - Startup Software Solutions | CiroStack",
  description:
    "CiroStack builds custom software for startups. Explore our by challenge offerings with fixed-price engagements and senior engineers.",
  alternates: { canonical: "https://cirostack.com/startups/by-challenge" },
  openGraph: {
    url: "https://cirostack.com/startups/by-challenge",
    title: "By Challenge - Software for Startups | CiroStack",
    description:
      "Fixed-price startup software development. Senior engineers. Shipped in weeks.",
  },
};

export default function ByChallengePage() {
  return <StartupCategory categoryId="by-challenge" />;
}
