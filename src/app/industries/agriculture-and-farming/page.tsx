import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Agriculture & Farming Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Agriculture & Farming industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/agriculture-and-farming" },
  openGraph: {
    url: "https://cirostack.com/industries/agriculture-and-farming",
    title: "Agriculture & Farming Software Solutions | CiroStack",
    description:
      "Custom software for the Agriculture & Farming industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/api/og?title=Agriculture%20%26%20Farming%20Software%20Solutions%20%7C%20CiroStack&description=Custom%20software%20for%20the%20Agriculture%20%26%20Farming%20industry.%20Fixed-price.%20Senior%20engineers.%20Shipped%20in%20weeks.&label=Industries", width: 1200, height: 630, alt: "CiroStack Agriculture And Farming" }],
  },
};

export default function AgricultureAndFarmingPage() {
  return <IndustryCategory categoryId="agriculture-and-farming" />;
}
