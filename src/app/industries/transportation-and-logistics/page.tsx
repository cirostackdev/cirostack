import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Transportation & Logistics Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Transportation & Logistics industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/transportation-and-logistics" },
  openGraph: {
    url: "https://cirostack.com/industries/transportation-and-logistics",
    title: "Software for Transportation & Logistics | CiroStack",
    description:
      "Fleet tracking, route optimization, and warehouse management tools for trucking companies, couriers, and logistics providers. We build software that moves your business forward, literally.",
    images: [{ url: "https://cirostack.com/og/industries/transportation-and-logistics.jpg", width: 1200, height: 630, alt: "CiroStack Transportation And Logistics" }],
  },
};

export default function TransportationAndLogisticsPage() {
  return <IndustryCategory categoryId="transportation-and-logistics" />;
}
