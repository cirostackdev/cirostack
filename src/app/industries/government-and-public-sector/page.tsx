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
    images: [{ url: "https://cirostack.com/api/og?title=Government%20%26%20Public%20Sector%20Software%20Solutions%20%7C%20CiroStack&description=Custom%20software%20for%20the%20Government%20%26%20Public%20Sector%20industry.%20Fixed-price.%20Senior%20engineers.%20Shipped%20in%20weeks.&label=Industries", width: 1200, height: 630, alt: "CiroStack Government And Public Sector" }],
  },
};

export default function GovernmentAndPublicSectorPage() {
  return <IndustryCategory categoryId="government-and-public-sector" />;
}
