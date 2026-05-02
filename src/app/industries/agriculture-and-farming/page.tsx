import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Agriculture & Farming Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Agriculture & Farming industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/agriculture-and-farming" },
  openGraph: {
    url: "https://cirostack.com/industries/agriculture-and-farming",
    title: "Software for Agriculture & Farming — CiroStack",
    description:
      "We build custom software for farms, agribusinesses, and agricultural co-ops. From precision agriculture dashboards to supply chain tools — built by senior engineers at a fixed price.",
    images: [{ url: "https://cirostack.com/og/industries/agriculture-and-farming.jpg", width: 1200, height: 630, alt: "CiroStack Agriculture And Farming" }],
  },
};

export default function AgricultureAndFarmingPage() {
  return <IndustryCategory categoryId="agriculture-and-farming" />;
}
