import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Technology & Startups Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Technology & Startups industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/technology-and-startups" },
  openGraph: {
    url: "https://cirostack.com/industries/technology-and-startups",
    title: "Technology & Startups Software Solutions | CiroStack",
    description:
      "Custom software for the Technology & Startups industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Technology & Startups" }],
  },
};

export default function TechnologyAndStartupsPage() {
  return <IndustryCategory categoryId="technology-and-startups" />;
}
