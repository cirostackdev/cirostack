import type { Metadata } from "next";
import IndustryCategory from "@/pages-src/IndustryCategory";

export const metadata: Metadata = {
  title: "Hospitality & Tourism Software Solutions",
  description:
    "CiroStack builds custom software, apps, and AI solutions for the Hospitality & Tourism industry. Fixed-price engagements with senior engineers.",
  alternates: { canonical: "https://cirostack.com/industries/hospitality-and-tourism" },
  openGraph: {
    url: "https://cirostack.com/industries/hospitality-and-tourism",
    title: "Hospitality & Tourism Software Solutions | CiroStack",
    description:
      "Custom software for the Hospitality & Tourism industry. Fixed-price. Senior engineers. Shipped in weeks.",
    images: [{ url: "https://cirostack.com/images/pages/hero-industry.jpg", width: 1200, height: 630, alt: "CiroStack Hospitality & Tourism" }],
  },
};

export default function HospitalityAndTourismPage() {
  return <IndustryCategory categoryId="hospitality-and-tourism" />;
}
