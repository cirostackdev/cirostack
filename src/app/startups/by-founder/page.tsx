import type { Metadata } from "next";
import StartupCategory from "@/pages-src/StartupCategory";

export const metadata: Metadata = {
  title: "By Founder Type - Startup Software Solutions | CiroStack",
  description:
    "CiroStack builds custom software for startups. Explore our by founder type offerings with fixed-price engagements and senior engineers.",
  alternates: { canonical: "https://cirostack.com/startups/by-founder" },
  openGraph: {
    url: "https://cirostack.com/startups/by-founder",
    title: "By Founder Type - Software for Startups | CiroStack",
    description:
      "Fixed-price startup software development. Senior engineers. Shipped in weeks.",
  },
};

export default function ByFounderPage() {
  return <StartupCategory categoryId="by-founder" />;
}
