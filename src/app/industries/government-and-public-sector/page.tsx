import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Government & Public Sector Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Government & Public Sector industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/government-and-public-sector" },
  openGraph: {
    url: "https://cirostack.com/industries/government-and-public-sector",
    title: "Software for Government & Public Sector | CiroStack",
    description:
      "Citizen portals, case management systems, and public service platforms for government agencies. We build accessible, secure software that makes government services work better for everyone.",
    images: [{ url: "https://cirostack.com/og/industries/government-and-public-sector.jpg", width: 1200, height: 630, alt: "CiroStack Government And Public Sector" }],
  },
};

export default function GovernmentAndPublicSectorPage() {
  return <IndustryCategory categoryId="government-and-public-sector" />;
}
