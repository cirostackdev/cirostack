import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Technology & Startups Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Technology & Startups industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/technology-and-startups" },
  openGraph: {
    url: "https://cirostack.com/industries/technology-and-startups",
    title: "Software for Tech Companies & Startups — CiroStack",
    description:
      "MVP development, platform engineering, and scale-up support for startups and tech companies. We help you go from idea to shipped product fast — then scale it without re-architecting.",
    images: [{ url: "https://cirostack.com/og/industries/technology-and-startups.jpg", width: 1200, height: 630, alt: "CiroStack Technology And Startups" }],
  },
};

export default function TechnologyAndStartupsPage() {
  return <IndustryCategory categoryId="technology-and-startups" />;
}
