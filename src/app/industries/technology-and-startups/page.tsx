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
    images: [{ url: "https://cirostack.com/api/og?title=Technology%20%26%20Startups%20Software%20Solutions%20%7C%20CiroStack&description=Custom%20software%20for%20the%20Technology%20%26%20Startups%20industry.%20Fixed-price.%20Senior%20engineers.%20Shipped%20in%20weeks.&label=Industries", width: 1200, height: 630, alt: "CiroStack Technology And Startups" }],
  },
};

export default function TechnologyAndStartupsPage() {
  return <IndustryCategory categoryId="technology-and-startups" />;
}
