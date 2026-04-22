import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Transportation & Logistics Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Transportation & Logistics industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/transportation-and-logistics" },
  openGraph: {
    url: "https://cirostack.com/industries/transportation-and-logistics",
    title: "Transportation & Logistics Software Solutions | CiroStack",
    description:
      "Custom software for the Transportation & Logistics industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Transportation & Logistics" }],
  },
};

export default function TransportationAndLogisticsPage() {
  return <IndustryCategory categoryId="transportation-and-logistics" />;
}
