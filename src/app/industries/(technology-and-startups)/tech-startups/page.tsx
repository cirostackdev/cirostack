import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "tech-startups";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/tech-startups` },
  openGraph: {
    url: `https://cirostack.com/industries/tech-startups`,
    title: "Custom Software for Tech Startups — CiroStack",
    description: "Our senior engineers build MVPs, internal tools, and customer-facing platforms for tech startups moving fast — fixed-price delivery so you know exactly what you're spending.",
    images: [{ url: "https://cirostack.com/og/industry-pages/tech-startups.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/tech-startups.jpg"],
  },
};

export default function TechStartupsPage() {
  return <Industry />;
}
