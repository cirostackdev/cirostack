import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Government & Public Sector Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Government & Public Sector industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/government-and-public-sector" },
  openGraph: {
    url: "https://cirostack.com/industries/government-and-public-sector",
    title: "Government & Public Sector Software Solutions | CiroStack",
    description:
      "Custom software for the Government & Public Sector industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Government & Public Sector" }],
  },
};

export default function GovernmentAndPublicSectorPage() {
  return <IndustryCategory categoryId="government-and-public-sector" />;
}
