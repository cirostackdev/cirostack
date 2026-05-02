import type { Metadata } from "next";
import { industriesData } from "@/data/industries-generated";
import Industry from "@/pages-src/Industry";

const slug = "health-advocacy";
const industry = industriesData[slug];

export const metadata: Metadata = {
  title: industry ? `${industry.title} | CiroStack` : "Industry | CiroStack",
  description: industry?.tagline ?? "",
  alternates: { canonical: `https://cirostack.com/industries/health-advocacy` },
  openGraph: {
    url: `https://cirostack.com/industries/health-advocacy`,
    title: "Custom Software for Health Advocacy | CiroStack",
    description: "Our senior engineers build patient resource directories, campaign tracking tools, and community outreach platforms for health advocacy organizations reaching the people who need them.",
    images: [{ url: "https://cirostack.com/og/industry-pages/health-advocacy.jpg", width: 1200, height: 630, alt: industry?.title ?? "CiroStack" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://cirostack.com/og/industry-pages/health-advocacy.jpg"],
  },
};

export default function HealthAdvocacyPage() {
  return <Industry />;
}
