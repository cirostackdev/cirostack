import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Manufacturing & Industrial Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Manufacturing & Industrial industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/manufacturing-and-industrial" },
  openGraph: {
    url: "https://cirostack.com/industries/manufacturing-and-industrial",
    title: "Software for Manufacturing & Industrial — CiroStack",
    description:
      "Production monitoring, supply chain management, and factory automation tools for manufacturers. We build software that connects your plant floor to your boardroom with real-time data.",
    images: [{ url: "https://cirostack.com/og/industries/manufacturing-and-industrial.jpg", width: 1200, height: 630, alt: "CiroStack Manufacturing And Industrial" }],
  },
};

export default function ManufacturingAndIndustrialPage() {
  return <IndustryCategory categoryId="manufacturing-and-industrial" />;
}
